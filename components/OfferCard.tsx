import type { Offer } from '@/lib/types';
import { RankBadge } from '@/components/RankBadge';

interface OfferCardProps {
  offer: Offer;
  rank: number;
  rankReason: string;
}

function formatExpiry(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  const d = new Date(expiresAt);
  return d.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatLastVerified(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function offerTypeLabel(offer: Offer): string {
  switch (offer.type) {
    case 'CODE':
      return 'Promo code';
    case 'DEAL':
      return 'Deal';
    case 'SALE':
      return 'Sale';
  }
}

export function OfferCard({ offer, rank, rankReason }: OfferCardProps) {
  const expiryLabel = formatExpiry(offer.expiresAt);
  const lastVerified = formatLastVerified(offer.lastVerifiedAt);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <RankBadge rank={rank} reason={rankReason} />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-slate-500">{offerTypeLabel(offer)}</p>
          <h3 className="mt-1 text-lg font-semibold leading-tight">{offer.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{offer.description}</p>
          {offer.terms && (
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Terms:</span> {offer.terms}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Estimated savings only. Final discount depends on cart and retailer terms.
          </p>
        </div>

        {offer.type === 'CODE' && offer.code && (
          <div className="shrink-0">
            <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Code
            </span>
            <code className="mt-1 inline-block rounded-md border border-dashed border-slate-400 bg-slate-50 px-3 py-2 font-mono text-base font-semibold">
              {offer.code}
            </code>
          </div>
        )}
      </div>

      <footer className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {expiryLabel && <span>Expires {expiryLabel}</span>}
        {typeof offer.minSpend === 'number' && <span>Min spend ${offer.minSpend}</span>}
        {lastVerified && <span>Last verified {lastVerified}</span>}
      </footer>
    </article>
  );
}
