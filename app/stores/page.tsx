import Link from 'next/link';
import { StoreCard } from '@/components/StoreCard';
import { getOffers, loadStores } from '@/lib/data';

export const metadata = { title: 'All stores · Coupon Scout AU' };
export const dynamic = 'force-dynamic';

export default function StoresIndexPage() {
  const stores = loadStores().slice().sort((a, b) => a.name.localeCompare(b.name));
  const offers = getOffers();
  const activeByStore = new Map<string, number>();
  for (const o of offers) {
    if (o.status === 'ACTIVE') {
      activeByStore.set(o.storeId, (activeByStore.get(o.storeId) ?? 0) + 1);
    }
  }

  return (
    <main className="mx-auto max-w-[720px] px-5 pb-20 pt-10">
      <nav className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">Stores</span>
      </nav>

      <header className="mt-6">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">All stores</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Browse {stores.length} Australian stores with currently listed coupons and offers.
        </p>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            activeOfferCount={activeByStore.get(store.id) ?? 0}
          />
        ))}
      </section>
    </main>
  );
}
