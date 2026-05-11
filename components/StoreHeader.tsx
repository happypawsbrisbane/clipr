import type { Store } from '@/lib/types';

interface StoreHeaderProps {
  store: Store;
  activeOfferCount: number;
}

export function StoreHeader({ store, activeOfferCount }: StoreHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-6">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {store.category}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
        {store.name}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {activeOfferCount} active {activeOfferCount === 1 ? 'offer' : 'offers'} ranked by best
        currently available savings.{' '}
        <a
          href={store.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-4 hover:underline"
        >
          Visit {store.name}
        </a>
      </p>
    </header>
  );
}
