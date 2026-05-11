import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OfferCard } from '@/components/OfferCard';
import { StoreHeader } from '@/components/StoreHeader';
import { findStoreBySlug, loadSeedReports, offersForStore } from '@/lib/data';
import { rankOffers } from '@/lib/ranking';

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

  const ranked = rankOffers(offersForStore(store.id), { reports: loadSeedReports() });

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

      {ranked.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No active offers for {store.name} right now. Check back soon.
        </p>
      ) : (
        <ol className="mt-8 space-y-4">
          {ranked.map((r, i) => (
            <li key={r.offer.id}>
              <OfferCard offer={r.offer} rank={i + 1} rankReason={r.rankReason} />
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
