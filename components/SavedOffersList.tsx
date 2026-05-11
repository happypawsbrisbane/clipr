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
      <p className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Loading your saved offers…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        You haven&apos;t saved any offers yet. Browse a store and tap{' '}
        <span className="font-semibold">Save</span> on the offers you want to come back to.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map(({ saved, offer, store }) => {
        const expiry = formatExpiry(offer.expiresAt);
        return (
          <li
            key={saved.offerId}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-slate-500">{store.name}</p>
                <h3 className="mt-1 text-base font-semibold leading-tight">
                  <Link href={`/stores/${store.slug}`} className="hover:underline">
                    {offer.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-600">{offer.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {offer.type === 'CODE' && offer.code && (
                    <span className="mr-3">
                      Code: <code className="rounded bg-slate-100 px-1 font-mono">{offer.code}</code>
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
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:border-accent"
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
