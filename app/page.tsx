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
    <main className="mx-auto max-w-[720px] px-5 pb-20 pt-16 sm:pt-20">
      <header>
        <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
          Australian coupons, ranked honestly
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Coupon Scout AU
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-mute">
          The best currently available coupons and sale offers, each with a plain-English reason
          why it ranks first. No fake countdowns. No paid placement.
        </p>
      </header>

      <section className="mt-10">
        <SearchBar />
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between border-b border-hairline pb-3">
          <h2 className="font-serif text-xl text-ink">Featured stores</h2>
          <Link
            href="/stores"
            className="font-sans text-[11px] font-medium uppercase tracking-meta text-accent underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            See all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {featured.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              activeOfferCount={activeByStore.get(store.id) ?? 0}
            />
          ))}
        </div>
      </section>

      <footer className="mt-20 border-t border-hairline pt-6 text-xs leading-relaxed text-mute">
        <p className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-[11px] font-medium uppercase tracking-meta">
          <Link href="/dashboard" className="text-accent underline-offset-4 hover:underline">
            Saved offers
          </Link>
          <Link href="/how-we-rank" className="text-accent underline-offset-4 hover:underline">
            How we rank
          </Link>
        </p>
        <p className="mt-3">
          Mock data only. No live integrations. Savings shown are estimates and subject to retailer
          terms.
        </p>
      </footer>
    </main>
  );
}
