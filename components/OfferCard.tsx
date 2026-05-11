import type { Offer, Store } from '@/lib/types';
import { OfferCTA } from '@/components/OfferCTA';
import { RankReason } from '@/components/RankBadge';
import { SaveButton } from '@/components/SaveButton';
import { VerificationButtons } from '@/components/VerificationButtons';

interface OfferCardProps {
  offer: Offer;
  store: Store;
  rank: number;
  rankReason: string;
  reportTally: { worked: number; didntWork: number };
}

function formatExpiry(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  return new Date(expiresAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysAgo(iso?: string): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.round((now - then) / 86_400_000));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months === 1) return '1 month ago';
  return `${months} months ago`;
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

function savingHeadline(offer: Offer): { value: string; unit?: string } {
  const v = offer.discountValue;
  switch (offer.discountType) {
    case 'PERCENT':
      return v ? { value: `${v}%`, unit: 'off' } : { value: 'Discount' };
    case 'FIXED':
      return v ? { value: `$${v}`, unit: 'off' } : { value: 'Discount' };
    case 'FREE_SHIPPING':
      return { value: 'Free', unit: 'shipping' };
    case 'BOGO':
      return { value: 'Buy 1', unit: 'get 1' };
    case 'OTHER':
      return { value: 'Sale' };
  }
}

function VerifiedTick({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

export function OfferCard({ offer, store, rank, rankReason, reportTally }: OfferCardProps) {
  const isTopPick = rank === 1;
  const expiryLabel = formatExpiry(offer.expiresAt);
  const verifiedAgo = daysAgo(offer.lastVerifiedAt);
  const saving = savingHeadline(offer);
  const totalReports = reportTally.worked + reportTally.didntWork;
  const workedPct =
    totalReports > 0 ? Math.round((reportTally.worked / totalReports) * 100) : null;

  return (
    <article
      className={
        'relative bg-paper p-5 sm:p-6 ' +
        (isTopPick
          ? 'border border-accent ring-1 ring-accent/40'
          : 'border border-hairline')
      }
    >
      {isTopPick && (
        <span className="absolute -top-2.5 left-5 inline-flex items-center bg-paper px-2 font-sans text-[10px] font-semibold uppercase tracking-meta text-accent">
          Top pick
        </span>
      )}

      <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        {store.name} · {offerTypeLabel(offer)}
      </p>

      <p
        className={
          'mt-2 font-serif leading-none text-ink ' +
          (isTopPick ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl')
        }
      >
        <span className="font-medium">{saving.value}</span>
        {saving.unit && (
          <span className="ml-2 align-baseline text-2xl font-normal text-mute sm:text-3xl">
            {saving.unit}
          </span>
        )}
      </p>

      <h3 className="mt-3 font-serif text-lg leading-snug text-ink">{offer.title}</h3>
      {offer.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{offer.description}</p>
      )}

      <RankReason rank={rank} reason={rankReason} highlighted={isTopPick} />

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {offer.type === 'CODE' && offer.code && (
            <>
              <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
                Code
              </p>
              <code className="mt-1.5 inline-block border border-dashed border-mute/60 bg-accent-soft px-3 py-1.5 font-mono text-base font-semibold tracking-wider text-ink">
                {offer.code}
              </code>
            </>
          )}
        </div>
        <OfferCTA offer={offer} store={store} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        {verifiedAgo && (
          <span className="inline-flex items-center gap-1.5">
            <VerifiedTick className="h-3.5 w-3.5 text-accent" />
            Verified {verifiedAgo}
          </span>
        )}
        {workedPct !== null && (
          <span>
            {workedPct}% of {totalReports} say it works
          </span>
        )}
        {expiryLabel && <span>Expires {expiryLabel}</span>}
        {typeof offer.minSpend === 'number' && <span>Min spend ${offer.minSpend}</span>}
      </div>

      {offer.terms && (
        <p className="mt-3 text-xs leading-relaxed text-mute">
          <span className="font-medium text-ink">Terms.</span> {offer.terms}
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-mute">
        Estimated savings only. Final discount depends on cart and retailer terms.
      </p>

      <div className="mt-5 border-t border-hairline pt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <VerificationButtons
            offerId={offer.id}
            initialWorked={reportTally.worked}
            initialDidntWork={reportTally.didntWork}
          />
          <SaveButton offerId={offer.id} />
        </div>
      </div>
    </article>
  );
}
