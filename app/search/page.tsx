import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { StoreCard } from '@/components/StoreCard';
import { getOffers, loadStores } from '@/lib/data';
import { searchStores } from '@/lib/search';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = { title: 'Search · Coupon Scout AU' };
export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const trimmed = q.trim();
  const stores = loadStores();
  const matches = searchStores(trimmed, stores);

  const activeByStore = new Map<string, number>();
  for (const o of getOffers()) {
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
        <span aria-current="page">Search</span>
      </nav>

      <header className="mt-6">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">Search stores</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Find Australian stores by name or category.
        </p>
      </header>

      <section className="mt-8">
        <SearchBar defaultValue={trimmed} />
      </section>

      <section className="mt-10" aria-live="polite">
        {trimmed === '' ? (
          <p className="border border-dashed border-hairline bg-paper p-6 text-sm text-mute">
            Enter a store name or category above to get started.
          </p>
        ) : matches.length === 0 ? (
          <p className="border border-dashed border-hairline bg-paper p-6 text-sm text-mute">
            No stores match <span className="font-medium text-ink">{trimmed}</span>. Try a
            different name or{' '}
            <Link href="/stores" className="text-accent underline-offset-4 hover:underline">
              browse all stores
            </Link>
            .
          </p>
        ) : (
          <>
            <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} for{' '}
              <span className="text-ink">{trimmed}</span>
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
