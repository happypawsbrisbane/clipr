import Link from 'next/link';
import type { Offer, Store } from '@/lib/types';

interface OfferCTAProps {
  offer: Offer;
  store: Store;
}

export function OfferCTA({ offer, store }: OfferCTAProps) {
  const isAffiliate = Boolean(offer.affiliateUrl);
  return (
    <div className="sm:text-right">
      <Link
        href={`/api/click/${offer.id}`}
        rel="nofollow sponsored noopener"
        target="_blank"
        prefetch={false}
        aria-label={`Shop at ${store.name} (opens in new tab)`}
        className="inline-flex items-center justify-center bg-accent px-5 py-2.5 font-sans text-sm font-medium text-ink transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        Shop at {store.name}
        <span aria-hidden="true" className="ml-1.5">↗</span>
      </Link>
      {isAffiliate && (
        <p className="mt-2 text-[11px] leading-snug text-mute sm:max-w-[18rem]">
          <span className="font-medium uppercase tracking-meta text-ink">Affiliate link.</span>{' '}
          We may earn a commission. Does not affect ranking —{' '}
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
