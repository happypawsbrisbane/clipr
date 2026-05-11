import type { Store } from '@/lib/types';

interface StoreHeaderProps {
  store: Store;
  activeOfferCount: number;
}

export function StoreHeader({ store, activeOfferCount }: StoreHeaderProps) {
  return (
    <header className="border-b border-hairline pb-6">
      <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        {store.category}
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {store.name}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-mute">
        {activeOfferCount} active {activeOfferCount === 1 ? 'offer' : 'offers'}, ranked by best
        currently available savings.{' '}
        <a
          href={store.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-4 hover:underline"
        >
          Visit {store.name} ↗
        </a>
      </p>
    </header>
  );
}
