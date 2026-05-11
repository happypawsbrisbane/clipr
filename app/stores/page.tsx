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
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Stores</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">All stores</h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse {stores.length} Australian stores with currently listed coupons and offers.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
