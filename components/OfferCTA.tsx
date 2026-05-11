import Link from 'next/link';
import type { Offer, Store } from '@/lib/types';

interface OfferCTAProps {
  offer: Offer;
  store: Store;
}

export function OfferCTA({ offer, store }: OfferCTAProps) {
  const isAffiliate = Boolean(offer.affiliateUrl);
  return (
    <div className="mt-3">
      <Link
        href={`/api/click/${offer.id}`}
        rel="nofollow sponsored noopener"
        target="_blank"
        prefetch={false}
        aria-label={`Shop at ${store.name} (opens in new tab)`}
        className="inline-flex items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        Shop at {store.name}
        <span aria-hidden="true" className="ml-1">↗</span>
      </Link>
      {isAffiliate && (
        <p className="mt-2 text-[11px] leading-snug text-slate-500">
          <span className="mr-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">
            Affiliate link
          </span>
          We may earn a commission if you buy through this link. It does not affect which offer
          ranks first &mdash;{' '}
          <Link
            href="/how-we-rank"
            className="text-accent underline-offset-4 hover:underline"
          >
            see how we rank
          </Link>
          .
        </p>
      )}
    </div>
  );
}
