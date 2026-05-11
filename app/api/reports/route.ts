import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { loadOffers } from '@/lib/data';
import { addReport, hasVoted, tallyFor } from '@/lib/reports-store';

const ANON_COOKIE = 'csa_aid';

const bodySchema = z.object({
  offerId: z.string().min(1),
  vote: z.enum(['WORKED', 'DIDNT_WORK']),
  comment: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { offerId, vote, comment } = parsed.data;

  const offer = loadOffers().find((o) => o.id === offerId);
  if (!offer) {
    return NextResponse.json({ error: 'unknown offer' }, { status: 404 });
  }

  const cookieStore = await cookies();
  let anonId = cookieStore.get(ANON_COOKIE)?.value;
  let mintedAnon = false;
  if (!anonId) {
    anonId = crypto.randomUUID();
    mintedAnon = true;
  }

  if (await hasVoted(offerId, anonId)) {
    return NextResponse.json(
      { error: 'already voted on this offer', tally: await tallyFor(offerId) },
      { status: 409 },
    );
  }

  await addReport({ offerId, vote, comment, anonId });

  const response = NextResponse.json({ ok: true, tally: await tallyFor(offerId) });
  if (mintedAnon) {
    response.cookies.set(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      // 180 days. Anonymous identifier only; documented on /how-we-rank.
      maxAge: 60 * 60 * 24 * 180,
    });
  }
  return response;
}
