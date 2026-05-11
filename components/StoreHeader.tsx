import type { Store } from '@/lib/types';

interface StoreHeaderProps {
  store: Store;
  activeOfferCount: number;
}

export function StoreHeader({ store, activeOfferCount }: StoreHeaderProps) {
  return (
    <header className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-slate-100 sm:aspect-[4/1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={store.coverImageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-wide text-slate-500">{store.category}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{store.name}</h1>
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
      </div>
    </header>
  );
}
