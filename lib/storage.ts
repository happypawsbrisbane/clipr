// localStorage-backed saved-offers list. Client-only. Keys are namespaced so
// they don't collide with anything else added later. v1 has no accounts, so
// "saved" is per-browser by design.

import type { SavedOfferRef } from '@/lib/types';

const KEY = 'csa.savedOffers.v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getSavedOffers(): SavedOfferRef[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is SavedOfferRef =>
        x &&
        typeof x === 'object' &&
        typeof x.offerId === 'string' &&
        typeof x.savedAt === 'string',
    );
  } catch {
    return [];
  }
}

export function isOfferSaved(offerId: string): boolean {
  return getSavedOffers().some((s) => s.offerId === offerId);
}

export function saveOffer(offerId: string): SavedOfferRef[] {
  if (!isBrowser()) return [];
  const current = getSavedOffers();
  if (current.some((s) => s.offerId === offerId)) return current;
  const next = [...current, { offerId, savedAt: new Date().toISOString() }];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function unsaveOffer(offerId: string): SavedOfferRef[] {
  if (!isBrowser()) return [];
  const next = getSavedOffers().filter((s) => s.offerId !== offerId);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
