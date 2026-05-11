import { describe, expect, it } from 'vitest';
import { loadOffers, loadSeedReports, loadStores } from '@/lib/data';

describe('mock data validates against the schema', () => {
  it('loads stores without throwing', () => {
    const stores = loadStores();
    expect(stores.length).toBeGreaterThanOrEqual(8);
    for (const s of stores) {
      expect(s.country).toBe('AU');
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('loads offers without throwing and references real stores', () => {
    const offers = loadOffers();
    const storeIds = new Set(loadStores().map((s) => s.id));
    expect(offers.length).toBeGreaterThanOrEqual(20);
    for (const o of offers) {
      expect(storeIds.has(o.storeId)).toBe(true);
    }
  });

  it('CODE offers carry a code, non-CODE offers do not', () => {
    for (const o of loadOffers()) {
      if (o.type === 'CODE') {
        expect(o.code, `offer ${o.id} of type CODE missing code`).toBeTruthy();
      } else {
        expect(o.code, `offer ${o.id} of type ${o.type} unexpectedly has a code`).toBeUndefined();
      }
    }
  });

  it('seed reports reference real offers', () => {
    const offerIds = new Set(loadOffers().map((o) => o.id));
    for (const r of loadSeedReports()) {
      expect(offerIds.has(r.offerId)).toBe(true);
    }
  });

  it('covers every discount type at least once', () => {
    const seen = new Set(loadOffers().map((o) => o.discountType));
    for (const dt of ['PERCENT', 'FIXED', 'FREE_SHIPPING', 'BOGO', 'OTHER']) {
      expect(seen.has(dt as 'PERCENT')).toBe(true);
    }
  });

  it('covers every offer status at least once', () => {
    const seen = new Set(loadOffers().map((o) => o.status));
    for (const st of ['ACTIVE', 'PENDING', 'EXPIRED', 'REMOVED']) {
      expect(seen.has(st as 'ACTIVE')).toBe(true);
    }
  });
});
