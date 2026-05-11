import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { StoreCard } from '@/components/StoreCard';
import { getOffers, loadStores } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const stores = loadStores();
  const offers = getOffers();
  const activeByStore = new Map<string, number>();
  for (const o of offers) {
    if (o.status === 'ACTIVE') {
      activeByStore.set(o.storeId, (activeByStore.get(o.storeId) ?? 0) + 1);
    }
  }

  const featured = stores
    .slice()
    .sort((a, b) => (activeByStore.get(b.id) ?? 0) - (activeByStore.get(a.id) ?? 0))
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Coupon Scout AU</h1>
        <p className="mt-3 text-base text-slate-600">
          Find the best currently available Australian coupons and sale offers, with a transparent
          reason why each one ranks first.
        </p>
      </header>

      <section className="mt-8">
        <SearchBar />
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Featured stores</h2>
          <Link
            href="/stores"
            className="text-sm text-accent underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            See all stores
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {featured.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              activeOfferCount={activeByStore.get(store.id) ?? 0}
            />
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          <Link href="/dashboard" className="text-accent underline-offset-4 hover:underline">
            View your saved offers
          </Link>
        </p>
        <p className="mt-2">
          Mock data only. No live integrations. Savings shown are estimates and subject to retailer
          terms.
        </p>
      </footer>
    </main>
  );
}
