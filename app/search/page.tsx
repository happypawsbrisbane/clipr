import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { StoreCard } from '@/components/StoreCard';
import { loadOffers, loadStores } from '@/lib/data';
import { searchStores } from '@/lib/search';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = { title: 'Search · Coupon Scout AU' };

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const trimmed = q.trim();
  const stores = loadStores();
  const matches = searchStores(trimmed, stores);

  const activeByStore = new Map<string, number>();
  for (const o of loadOffers()) {
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
        <span aria-current="page">Search</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Search stores</h1>
        <p className="mt-2 text-sm text-slate-600">
          Find Australian stores by name or category.
        </p>
      </header>

      <section className="mt-6">
        <SearchBar defaultValue={trimmed} />
      </section>

      <section className="mt-8" aria-live="polite">
        {trimmed === '' ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            Enter a store name or category above to get started.
          </p>
        ) : matches.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No stores match <span className="font-semibold">{trimmed}</span>. Try a different name
            or {' '}
            <Link href="/stores" className="text-accent underline-offset-4 hover:underline">
              browse all stores
            </Link>
            .
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} for{' '}
              <span className="font-semibold">{trimmed}</span>.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {matches.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  activeOfferCount={activeByStore.get(store.id) ?? 0}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
