import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loadStores, getOffers } from '@/lib/data';
import { recordClick } from '@/lib/clicks-store';

const ANON_COOKIE = 'csa_aid';

interface RouteContext {
  params: Promise<{ offerId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { offerId } = await context.params;

  const offer = getOffers().find((o) => o.id === offerId);
  if (!offer || offer.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'offer not found or inactive' }, { status: 404 });
  }
  const store = loadStores().find((s) => s.id === offer.storeId);
  if (!store) {
    return NextResponse.json({ error: 'store not found' }, { status: 404 });
  }

  const cookieStore = await cookies();
  let anonId = cookieStore.get(ANON_COOKIE)?.value;
  let mintedAnon = false;
  if (!anonId) {
    anonId = crypto.randomUUID();
    mintedAnon = true;
  }

  const destination = offer.affiliateUrl ?? store.websiteUrl;
  recordClick({
    offerId,
    anonId,
    kind: offer.affiliateUrl ? 'AFFILIATE' : 'DIRECT',
  });

  const response = NextResponse.redirect(destination, { status: 302 });
  if (mintedAnon) {
    response.cookies.set(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    });
  }
  return response;
}
