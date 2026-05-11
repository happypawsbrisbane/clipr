import { describe, expect, it } from 'vitest';
import {
  estimatedValue,
  freshness,
  rankOffers,
  sourceTrust,
  urgencyBoost,
  verificationScoreFor,
  wilsonLowerBound,
} from '@/lib/ranking';
import type { Offer, VerificationReport } from '@/lib/types';

const NOW = new Date('2026-05-11T00:00:00.000Z');

function offer(overrides: Partial<Offer> & { id: string }): Offer {
  return {
    storeId: 'store_1',
    type: 'CODE',
    title: 'Test offer',
    description: 'desc',
    code: 'TEST',
    discountType: 'PERCENT',
    discountValue: 20,
    startsAt: '2026-04-01T00:00:00.000Z',
    expiresAt: '2026-06-01T00:00:00.000Z',
    status: 'ACTIVE',
    source: 'MOCK',
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-04-01T00:00:00.000Z',
    ...overrides,
  };
}

function report(id: string, offerId: string, vote: 'WORKED' | 'DIDNT_WORK'): VerificationReport {
  return {
    id,
    offerId,
    vote,
    anonId: `anon_${id}`,
    createdAt: '2026-05-01T00:00:00.000Z',
  };
}

describe('wilsonLowerBound', () => {
  it('returns 0 for an empty sample', () => {
    expect(wilsonLowerBound(0, 0)).toBe(0);
  });

  it('penalises small samples relative to a large one', () => {
    const small = wilsonLowerBound(3, 3);
    const large = wilsonLowerBound(100, 100);
    expect(small).toBeLessThan(large);
    expect(large).toBeGreaterThan(0.9);
  });

  it('falls between 0 and 1', () => {
    for (const [pos, tot] of [
      [0, 5],
      [2, 5],
      [50, 100],
    ]) {
      const v = wilsonLowerBound(pos, tot);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('verificationScoreFor', () => {
  it('returns neutral 0.5 when fewer than 3 reports', () => {
    const result = verificationScoreFor([
      report('r1', 'o1', 'WORKED'),
      report('r2', 'o1', 'WORKED'),
    ]);
    expect(result.value).toBe(0.5);
    expect(result.total).toBe(2);
  });

  it('uses Wilson once 3+ reports exist', () => {
    const result = verificationScoreFor([
      report('r1', 'o1', 'WORKED'),
      report('r2', 'o1', 'WORKED'),
      report('r3', 'o1', 'WORKED'),
    ]);
    expect(result.value).toBeGreaterThan(0);
    expect(result.value).toBeLessThan(1);
    expect(result.value).not.toBe(0.5);
  });
});

describe('estimatedValue', () => {
  it('normalises PERCENT correctly', () => {
    expect(estimatedValue(offer({ id: 'a', discountType: 'PERCENT', discountValue: 30 }))).toBeCloseTo(0.3);
  });

  it('normalises FIXED capped at $100', () => {
    expect(estimatedValue(offer({ id: 'a', discountType: 'FIXED', discountValue: 20 }))).toBeCloseTo(0.2);
    expect(estimatedValue(offer({ id: 'b', discountType: 'FIXED', discountValue: 250 }))).toBe(1);
  });

  it('assigns BOGO above FREE_SHIPPING', () => {
    expect(estimatedValue(offer({ id: 'a', discountType: 'BOGO' }))).toBeGreaterThan(
      estimatedValue(offer({ id: 'b', discountType: 'FREE_SHIPPING' })),
    );
  });
});

describe('freshness', () => {
  it('returns 1 for an offer verified just now', () => {
    expect(
      freshness(offer({ id: 'a', lastVerifiedAt: NOW.toISOString() }), NOW),
    ).toBeCloseTo(1);
  });

  it('decays toward 0 as the offer ages', () => {
    const recent = freshness(
      offer({ id: 'a', lastVerifiedAt: '2026-05-10T00:00:00.000Z' }),
      NOW,
    );
    const old = freshness(
      offer({ id: 'b', lastVerifiedAt: '2025-12-01T00:00:00.000Z' }),
      NOW,
    );
    expect(recent).toBeGreaterThan(old);
    expect(old).toBeLessThan(0.05);
  });
});

describe('sourceTrust', () => {
  it('rewards MANUAL above MOCK', () => {
    expect(sourceTrust('MANUAL')).toBeGreaterThan(sourceTrust('MOCK'));
  });
});

describe('urgencyBoost', () => {
  it('boosts only inside the 24h window', () => {
    expect(urgencyBoost(offer({ id: 'a', expiresAt: '2026-05-11T12:00:00.000Z' }), NOW)).toBe(1);
    expect(urgencyBoost(offer({ id: 'b', expiresAt: '2026-05-20T00:00:00.000Z' }), NOW)).toBe(0);
    expect(urgencyBoost(offer({ id: 'c', expiresAt: undefined }), NOW)).toBe(0);
  });

  it('returns 0 once expired', () => {
    expect(urgencyBoost(offer({ id: 'a', expiresAt: '2026-05-10T00:00:00.000Z' }), NOW)).toBe(0);
  });
});

describe('rankOffers', () => {
  it('filters out non-ACTIVE statuses', () => {
    const list = rankOffers(
      [
        offer({ id: 'a', status: 'EXPIRED' }),
        offer({ id: 'b', status: 'PENDING', startsAt: '2026-06-01T00:00:00.000Z' }),
        offer({ id: 'c', status: 'REMOVED' }),
      ],
      { now: NOW },
    );
    expect(list).toHaveLength(0);
  });

  it('filters out offers whose expiresAt is in the past', () => {
    const list = rankOffers(
      [offer({ id: 'a', expiresAt: '2026-04-01T00:00:00.000Z' })],
      { now: NOW },
    );
    expect(list).toHaveLength(0);
  });

  it('filters out offers that have not yet started', () => {
    const list = rankOffers(
      [offer({ id: 'a', startsAt: '2026-06-01T00:00:00.000Z' })],
      { now: NOW },
    );
    expect(list).toHaveLength(0);
  });

  it('ranks higher % off above lower % off when other factors are equal', () => {
    const list = rankOffers(
      [
        offer({ id: 'small', discountValue: 10 }),
        offer({ id: 'big', discountValue: 30 }),
      ],
      { now: NOW },
    );
    expect(list[0].offer.id).toBe('big');
    expect(list[0].rankReason).toContain('30% off');
  });

  it('breaks score ties by earlier expiresAt first', () => {
    const list = rankOffers(
      [
        offer({
          id: 'later',
          discountValue: 20,
          expiresAt: '2026-07-01T00:00:00.000Z',
        }),
        offer({
          id: 'sooner',
          discountValue: 20,
          expiresAt: '2026-05-20T00:00:00.000Z',
        }),
      ],
      { now: NOW },
    );
    expect(list[0].offer.id).toBe('sooner');
  });

  it('applies the urgency boost so a 24h-expiring offer beats a slightly better but distant one', () => {
    const list = rankOffers(
      [
        offer({
          id: 'distant',
          discountValue: 22,
          expiresAt: '2026-06-30T00:00:00.000Z',
          source: 'MOCK',
        }),
        offer({
          id: 'urgent',
          discountValue: 20,
          expiresAt: '2026-05-11T20:00:00.000Z',
          source: 'MOCK',
        }),
      ],
      { now: NOW },
    );
    expect(list[0].offer.id).toBe('urgent');
    expect(list[0].rankReason).toContain('ends within 24 hours');
  });

  it('mentions verification once 3+ reports exist', () => {
    const offers = [
      offer({ id: 'verified', discountValue: 20 }),
      offer({ id: 'fresh', discountValue: 20 }),
    ];
    const reports: VerificationReport[] = [
      report('r1', 'verified', 'WORKED'),
      report('r2', 'verified', 'WORKED'),
      report('r3', 'verified', 'WORKED'),
      report('r4', 'verified', 'WORKED'),
    ];
    const list = rankOffers(offers, { now: NOW, reports });
    const verifiedRanked = list.find((r) => r.offer.id === 'verified');
    expect(verifiedRanked).toBeDefined();
    expect(verifiedRanked!.rankReason).toContain('users say it works');
  });

  it('every active offer carries a non-empty rankReason', () => {
    const list = rankOffers(
      [
        offer({ id: 'a', discountType: 'FREE_SHIPPING', discountValue: undefined }),
        offer({ id: 'b', discountType: 'BOGO', discountValue: undefined }),
      ],
      { now: NOW },
    );
    for (const r of list) {
      expect(r.rankReason.length).toBeGreaterThan(0);
    }
  });

  it('is stable: repeated calls produce identical ordering', () => {
    const offers = [
      offer({ id: 'a', discountValue: 20 }),
      offer({ id: 'b', discountValue: 20 }),
      offer({ id: 'c', discountValue: 20 }),
    ];
    const first = rankOffers(offers, { now: NOW }).map((r) => r.offer.id);
    const second = rankOffers(offers, { now: NOW }).map((r) => r.offer.id);
    expect(first).toEqual(second);
  });

  // Non-negotiable contract from CLAUDE.md: affiliate links are
  // disclosure-only and must NEVER influence the ranking score.
  it('produces identical scores and ordering whether affiliate fields are set', () => {
    const plain = [
      offer({ id: 'a', discountValue: 25 }),
      offer({ id: 'b', discountValue: 20 }),
      offer({ id: 'c', discountValue: 15 }),
    ];
    const withAffiliate = plain.map((o) => ({
      ...o,
      affiliateUrl: 'https://aff.example.test/awin/' + o.id,
      affiliateNetwork: 'AWIN' as const,
    }));

    const a = rankOffers(plain, { now: NOW });
    const b = rankOffers(withAffiliate, { now: NOW });

    expect(b.map((r) => r.offer.id)).toEqual(a.map((r) => r.offer.id));
    for (let i = 0; i < a.length; i++) {
      expect(b[i].score).toBe(a[i].score);
      expect(b[i].rankReason).toBe(a[i].rankReason);
    }
  });
});
