'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Offer, SavedOfferRef, Store } from '@/lib/types';
import { getSavedOffers, unsaveOffer } from '@/lib/storage';

interface SavedOffersListProps {
  offers: Offer[];
  stores: Store[];
}

interface SavedItem {
  saved: SavedOfferRef;
  offer: Offer;
  store: Store;
}

function formatExpiry(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  return new Date(expiresAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function SavedOffersList({ offers, stores }: SavedOffersListProps) {
  const [items, setItems] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    setItems(reconcile(getSavedOffers(), offers, stores));
  }, [offers, stores]);

  if (items === null) {
    return (
      <p className="border border-dashed border-hairline bg-paper p-6 text-sm text-mute">
        Loading your saved offers…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="border border-dashed border-hairline bg-paper p-6 text-sm text-mute">
        You haven&apos;t saved any offers yet. Browse a store and tap{' '}
        <span className="font-medium text-ink">Save</span> on the offers you want to come back to.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map(({ saved, offer, store }) => {
        const expiry = formatExpiry(offer.expiresAt);
        return (
          <li key={saved.offerId} className="border border-hairline bg-paper p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
                  {store.name}
                </p>
                <h3 className="mt-1.5 font-serif text-lg leading-snug text-ink">
                  <Link href={`/stores/${store.slug}`} className="hover:text-accent">
                    {offer.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-mute">{offer.description}</p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
                  {offer.type === 'CODE' && offer.code && (
                    <span>
                      Code{' '}
                      <code className="ml-1 bg-accent-soft px-1.5 py-0.5 font-mono text-[11px] tracking-wider text-ink">
                        {offer.code}
                      </code>
                    </span>
                  )}
                  {expiry && <span>Expires {expiry}</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  unsaveOffer(saved.offerId);
                  setItems((prev) =>
                    prev ? prev.filter((i) => i.saved.offerId !== saved.offerId) : prev,
                  );
                }}
                className="border border-hairline bg-paper px-3 py-1.5 font-sans text-sm font-medium text-ink hover:border-accent"
                aria-label={`Remove ${offer.title} from saved offers`}
              >
                Remove
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function reconcile(saved: SavedOfferRef[], offers: Offer[], stores: Store[]): SavedItem[] {
  const offerById = new Map(offers.map((o) => [o.id, o] as const));
  const storeById = new Map(stores.map((s) => [s.id, s] as const));
  const result: SavedItem[] = [];
  for (const ref of saved) {
    const offer = offerById.get(ref.offerId);
    if (!offer) continue;
    const store = storeById.get(offer.storeId);
    if (!store) continue;
    result.push({ saved: ref, offer, store });
  }
  return result;
}
