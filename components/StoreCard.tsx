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
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-accent hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={store.coverImageUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{store.name}</h3>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">
            {store.category}
          </p>
        </div>
        {typeof activeOfferCount === 'number' && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {activeOfferCount} {activeOfferCount === 1 ? 'offer' : 'offers'}
          </span>
        )}
      </div>
    </Link>
  );
}
