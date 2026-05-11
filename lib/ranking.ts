import type { Offer, OfferSource, VerificationReport } from '@/lib/types';

export interface RankedOffer {
  offer: Offer;
  score: number;
  rankReason: string;
  components: RankComponents;
}

export interface RankComponents {
  estimatedValue: number;
  verificationScore: number;
  verificationCount: number;
  verificationPositives: number;
  freshness: number;
  sourceTrust: number;
  urgencyBoost: number;
}

const WEIGHTS = {
  estimatedValue: 0.4,
  verificationScore: 0.25,
  freshness: 0.2,
  sourceTrust: 0.1,
  urgencyBoost: 0.05,
} as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const FRESHNESS_TAU_DAYS = 21;
const URGENCY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MIN_REPORTS_FOR_WILSON = 3;
const NEUTRAL_VERIFICATION = 0.5;

export function wilsonLowerBound(positives: number, total: number, z = 1.96): number {
  if (total === 0) return 0;
  const phat = positives / total;
  const denom = 1 + (z * z) / total;
  const center = phat + (z * z) / (2 * total);
  const margin = z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * total)) / total);
  return Math.max(0, Math.min(1, (center - margin) / denom));
}

export function estimatedValue(offer: Offer): number {
  const v = offer.discountValue ?? 0;
  switch (offer.discountType) {
    case 'PERCENT':
      return clamp01(v / 100);
    case 'FIXED':
      return clamp01(Math.min(v, 100) / 100);
    case 'FREE_SHIPPING':
      return 0.1;
    case 'BOGO':
      return 0.5;
    case 'OTHER':
      return 0.1;
  }
}

export function verificationScoreFor(reports: VerificationReport[]): {
  value: number;
  positives: number;
  total: number;
} {
  const total = reports.length;
  const positives = reports.filter((r) => r.vote === 'WORKED').length;
  if (total < MIN_REPORTS_FOR_WILSON) {
    return { value: NEUTRAL_VERIFICATION, positives, total };
  }
  return { value: wilsonLowerBound(positives, total), positives, total };
}

export function freshness(offer: Offer, now: Date): number {
  const baseTs = offer.lastVerifiedAt ?? offer.createdAt;
  const ageMs = Math.max(0, now.getTime() - new Date(baseTs).getTime());
  return Math.exp(-(ageMs / MS_PER_DAY) / FRESHNESS_TAU_DAYS);
}

export function sourceTrust(source: OfferSource): number {
  return source === 'MANUAL' ? 1.0 : 0.7;
}

export function urgencyBoost(offer: Offer, now: Date): number {
  if (!offer.expiresAt) return 0;
  const diff = new Date(offer.expiresAt).getTime() - now.getTime();
  if (diff <= 0) return 0;
  return diff <= URGENCY_WINDOW_MS ? 1 : 0;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function isActive(offer: Offer, now: Date): boolean {
  if (offer.status !== 'ACTIVE') return false;
  if (offer.expiresAt && new Date(offer.expiresAt).getTime() <= now.getTime()) return false;
  if (new Date(offer.startsAt).getTime() > now.getTime()) return false;
  return true;
}

export interface RankOptions {
  reports?: VerificationReport[];
  now?: Date;
}

export function rankOffers(offers: Offer[], options: RankOptions = {}): RankedOffer[] {
  const now = options.now ?? new Date();
  const reportsByOffer = groupReports(options.reports ?? []);

  const ranked = offers
    .filter((o) => isActive(o, now))
    .map<RankedOffer>((offer) => {
      const verification = verificationScoreFor(reportsByOffer.get(offer.id) ?? []);
      const components: RankComponents = {
        estimatedValue: estimatedValue(offer),
        verificationScore: verification.value,
        verificationCount: verification.total,
        verificationPositives: verification.positives,
        freshness: freshness(offer, now),
        sourceTrust: sourceTrust(offer.source),
        urgencyBoost: urgencyBoost(offer, now),
      };

      const score =
        WEIGHTS.estimatedValue * components.estimatedValue +
        WEIGHTS.verificationScore * components.verificationScore +
        WEIGHTS.freshness * components.freshness +
        WEIGHTS.sourceTrust * components.sourceTrust +
        WEIGHTS.urgencyBoost * components.urgencyBoost;

      return {
        offer,
        score,
        components,
        rankReason: buildRankReason(offer, components),
      };
    });

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aExp = a.offer.expiresAt ? new Date(a.offer.expiresAt).getTime() : Infinity;
    const bExp = b.offer.expiresAt ? new Date(b.offer.expiresAt).getTime() : Infinity;
    if (aExp !== bExp) return aExp - bExp;
    const aCreated = new Date(a.offer.createdAt).getTime();
    const bCreated = new Date(b.offer.createdAt).getTime();
    if (aCreated !== bCreated) return bCreated - aCreated;
    return a.offer.id.localeCompare(b.offer.id);
  });

  return ranked;
}

function groupReports(reports: VerificationReport[]): Map<string, VerificationReport[]> {
  const map = new Map<string, VerificationReport[]>();
  for (const r of reports) {
    const list = map.get(r.offerId);
    if (list) list.push(r);
    else map.set(r.offerId, [r]);
  }
  return map;
}

function buildRankReason(offer: Offer, c: RankComponents): string {
  const contributions: Array<{ key: keyof typeof WEIGHTS; weighted: number; phrase: string }> = [
    {
      key: 'estimatedValue',
      weighted: WEIGHTS.estimatedValue * c.estimatedValue,
      phrase: valuePhrase(offer),
    },
    {
      key: 'verificationScore',
      weighted: WEIGHTS.verificationScore * c.verificationScore,
      phrase: verificationPhrase(c),
    },
    {
      key: 'freshness',
      weighted: WEIGHTS.freshness * c.freshness,
      phrase: freshnessPhrase(c.freshness),
    },
    {
      key: 'sourceTrust',
      weighted: WEIGHTS.sourceTrust * c.sourceTrust,
      phrase: offer.source === 'MANUAL' ? 'manually verified by our team' : 'community-listed offer',
    },
    {
      key: 'urgencyBoost',
      weighted: WEIGHTS.urgencyBoost * c.urgencyBoost,
      phrase: c.urgencyBoost > 0 ? 'ends within 24 hours' : '',
    },
  ];

  const urgency = contributions.find((x) => x.key === 'urgencyBoost' && c.urgencyBoost > 0);
  const others = contributions
    .filter((x) => x.phrase.length > 0 && x.key !== 'urgencyBoost')
    .sort((a, b) => b.weighted - a.weighted);

  const top: string[] = [];
  if (urgency && urgency.phrase) top.push(urgency.phrase);
  for (const o of others) {
    if (top.length >= 2) break;
    top.push(o.phrase);
  }

  return top.length > 0 ? `Top pick: ${top.join('; ')}.` : 'Top pick.';
}

function valuePhrase(offer: Offer): string {
  switch (offer.discountType) {
    case 'PERCENT':
      return offer.discountValue ? `${offer.discountValue}% off` : 'percent discount';
    case 'FIXED':
      return offer.discountValue ? `$${offer.discountValue} off` : 'dollar discount';
    case 'FREE_SHIPPING':
      return 'free shipping';
    case 'BOGO':
      return 'buy-one-get-one offer';
    case 'OTHER':
      return 'sale price';
  }
}

function verificationPhrase(c: RankComponents): string {
  if (c.verificationCount < MIN_REPORTS_FOR_WILSON) {
    return c.verificationCount === 0
      ? 'awaiting user verification'
      : `${c.verificationCount} early ${c.verificationCount === 1 ? 'report' : 'reports'}`;
  }
  const pct = Math.round((c.verificationPositives / c.verificationCount) * 100);
  return `${pct}% of ${c.verificationCount} users say it works`;
}

function freshnessPhrase(value: number): string {
  if (value >= 0.85) return 'recently verified';
  if (value >= 0.5) return 'verified this month';
  return '';
}
