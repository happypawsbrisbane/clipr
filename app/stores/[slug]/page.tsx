import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OfferCard } from '@/components/OfferCard';
import { StoreHeader } from '@/components/StoreHeader';
import { findStoreBySlug, offersForStore } from '@/lib/data';
import { rankOffers } from '@/lib/ranking';
import { getAllReports, tallyFor } from '@/lib/reports-store';

// Reports are stored in memory and can change between requests, so this page
// must always render fresh.
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

  const ranked = rankOffers(offersForStore(store.id), { reports: getAllReports() });

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href="/stores" className="hover:underline">
          Stores
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{store.name}</span>
      </nav>

      <div className="mt-4">
        <StoreHeader store={store} activeOfferCount={ranked.length} />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Ranked by best estimated savings.{' '}
        <Link href="/how-we-rank" className="text-accent underline-offset-4 hover:underline">
          How we rank
        </Link>
      </p>

      {ranked.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No active offers for {store.name} right now. Check back soon.
        </p>
      ) : (
        <ol className="mt-8 space-y-4">
          {ranked.map((r, i) => {
            const t = tallyFor(r.offer.id);
            return (
              <li key={r.offer.id}>
                <OfferCard
                  offer={r.offer}
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
