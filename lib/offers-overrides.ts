// TODO(future): replace with a real persistence layer when the database
// arrives. v1 admin moderation lives in memory and resets on deploy.

import type { OfferStatus } from '@/lib/types';

const overrides = new Map<string, OfferStatus>();

export function setStatusOverride(offerId: string, status: OfferStatus): void {
  overrides.set(offerId, status);
}

export function clearStatusOverride(offerId: string): void {
  overrides.delete(offerId);
}

export function getStatusOverride(offerId: string): OfferStatus | undefined {
  return overrides.get(offerId);
}

export function getStatusOverrides(): ReadonlyMap<string, OfferStatus> {
  return overrides;
}
