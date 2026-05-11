import { z } from 'zod';
import storesJson from '@/data/stores.json';
import offersJson from '@/data/offers.json';
import reportsSeedJson from '@/data/reports.seed.json';
import {
  offerSchema,
  storeSchema,
  verificationReportSchema,
} from '@/lib/schema';
import { getStatusOverrides } from '@/lib/offers-overrides';
import type { Offer, Store, VerificationReport } from '@/lib/types';

function parseAll<T>(schema: z.ZodType<T>, raw: unknown, label: string): T[] {
  const list = z.array(schema).safeParse(raw);
  if (!list.success) {
    throw new Error(`Invalid ${label} data: ${list.error.message}`);
  }
  return list.data;
}

let storesCache: Store[] | null = null;
let offersCache: Offer[] | null = null;
let reportsSeedCache: VerificationReport[] | null = null;

export function loadStores(): Store[] {
  if (!storesCache) {
    storesCache = parseAll(storeSchema, storesJson, 'stores');
  }
  return storesCache;
}

export function loadOffers(): Offer[] {
  if (!offersCache) {
    offersCache = parseAll(offerSchema, offersJson, 'offers');
  }
  return offersCache;
}

// Effective view of offers: the JSON loader applies any in-memory admin
// overrides (status flips from /admin). Every page that displays offers
// must call this instead of loadOffers().
export function getOffers(): Offer[] {
  const overrides = getStatusOverrides();
  const base = loadOffers();
  if (overrides.size === 0) return base;
  return base.map((o) => {
    const ov = overrides.get(o.id);
    return ov ? { ...o, status: ov } : o;
  });
}

export function loadSeedReports(): VerificationReport[] {
  if (!reportsSeedCache) {
    reportsSeedCache = parseAll(verificationReportSchema, reportsSeedJson, 'reports');
  }
  return reportsSeedCache;
}

export function findStoreBySlug(slug: string): Store | undefined {
  return loadStores().find((s) => s.slug === slug);
}

export function offersForStore(storeId: string): Offer[] {
  return getOffers().filter((o) => o.storeId === storeId);
}

export function reportsForOffer(offerId: string, reports = loadSeedReports()): VerificationReport[] {
  return reports.filter((r) => r.offerId === offerId);
}
