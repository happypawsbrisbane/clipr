import Link from 'next/link';
import type { Store } from '@/lib/types';

interface StoreCardProps {
  store: Store;
  activeOfferCount?: number;
}

export function StoreCard({ store, activeOfferCount }: StoreCardProps) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className="group block border border-hairline bg-paper p-5 transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        {store.category}
      </p>
      <h3 className="mt-2 font-serif text-xl text-ink group-hover:text-accent">{store.name}</h3>
      {typeof activeOfferCount === 'number' && (
        <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
          {activeOfferCount} {activeOfferCount === 1 ? 'active offer' : 'active offers'}
        </p>
      )}
    </Link>
  );
}
