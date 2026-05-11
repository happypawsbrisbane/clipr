import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OfferCard } from '@/components/OfferCard';
import { StoreHeader } from '@/components/StoreHeader';
import { findStoreBySlug, offersForStore } from '@/lib/data';
import { rankOffers } from '@/lib/ranking';
import { getAllReports, tallyFor } from '@/lib/reports-store';

// Reports are persisted (DB when DATABASE_URL is set, in-memory otherwise) and
// change between requests, so this page must always render fresh.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const store = findStoreBySlug(slug);
  return {
    title: store ? `${store.name} coupons · Coupon Scout AU` : 'Store · Coupon Scout AU',
  };
}

export default async function StoreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const store = findStoreBySlug(slug);
  if (!store) {
    notFound();
  }

  const allReports = await getAllReports();
  const ranked = rankOffers(offersForStore(store.id), { reports: allReports });
  const tallies = await Promise.all(
    ranked.map((r) => tallyFor(r.offer.id).then((t) => [r.offer.id, t] as const)),
  );
  const tallyMap = new Map(tallies);

  return (
    <main className="mx-auto max-w-[720px] px-5 pb-20 pt-10">
      <nav className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <Link href="/stores" className="hover:text-accent">
          Stores
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">{store.name}</span>
      </nav>

      <div className="mt-6">
        <StoreHeader store={store} activeOfferCount={ranked.length} />
      </div>

      <p className="mt-4 font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        Ranked by best estimated savings ·{' '}
        <Link href="/how-we-rank" className="text-accent underline-offset-4 hover:underline">
          How we rank
        </Link>
      </p>

      {ranked.length === 0 ? (
        <p className="mt-10 border border-dashed border-hairline bg-paper p-6 text-sm text-mute">
          No active offers for {store.name} right now. Check back soon.
        </p>
      ) : (
        <ol className="mt-8 space-y-6">
          {ranked.map((r, i) => {
            const t = tallyMap.get(r.offer.id) ?? { worked: 0, didntWork: 0 };
            return (
              <li key={r.offer.id}>
                <OfferCard
                  offer={r.offer}
                  store={store}
                  rank={i + 1}
                  rankReason={r.rankReason}
                  reportTally={{ worked: t.worked, didntWork: t.didntWork }}
                />
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
