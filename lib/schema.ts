import { z } from 'zod';

export const countrySchema = z.literal('AU');

export const storeCategorySchema = z.enum([
  'fashion',
  'tech',
  'food',
  'home',
  'beauty',
  'travel',
  'sport',
  'kids',
  'other',
]);

export const storeSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, digits, and dashes'),
  name: z.string().min(1),
  category: storeCategorySchema,
  country: countrySchema,
  logoUrl: z.string().url(),
  coverImageUrl: z.string().url(),
  websiteUrl: z.string().url(),
  createdAt: z.string().datetime(),
});

export const offerTypeSchema = z.enum(['CODE', 'DEAL', 'SALE']);
export const discountTypeSchema = z.enum(['PERCENT', 'FIXED', 'FREE_SHIPPING', 'BOGO', 'OTHER']);
export const offerStatusSchema = z.enum(['ACTIVE', 'PENDING', 'EXPIRED', 'REMOVED']);
export const offerSourceSchema = z.enum(['MOCK', 'MANUAL']);
export const affiliateNetworkSchema = z.enum(['AWIN', 'CJ', 'RAKUTEN', 'IMPACT', 'OTHER']);

export const offerSchema = z
  .object({
    id: z.string().min(1),
    storeId: z.string().min(1),
    type: offerTypeSchema,
    title: z.string().min(1),
    description: z.string().min(1),
    code: z.string().min(1).optional(),
    discountType: discountTypeSchema,
    discountValue: z.number().nonnegative().optional(),
    minSpend: z.number().nonnegative().optional(),
    startsAt: z.string().datetime(),
    expiresAt: z.string().datetime().optional(),
    terms: z.string().optional(),
    status: offerStatusSchema,
    source: offerSourceSchema,
    lastVerifiedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    affiliateUrl: z.string().url().optional(),
    affiliateNetwork: affiliateNetworkSchema.optional(),
  })
  .superRefine((offer, ctx) => {
    if (offer.type === 'CODE' && !offer.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['code'],
        message: 'offers of type CODE must include a code',
      });
    }
    if (offer.type !== 'CODE' && offer.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['code'],
        message: 'code may only be set when type is CODE',
      });
    }
    if (
      (offer.discountType === 'PERCENT' || offer.discountType === 'FIXED') &&
      offer.discountValue === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['discountValue'],
        message: 'discountValue is required for PERCENT and FIXED discounts',
      });
    }
    if (offer.discountType === 'PERCENT' && offer.discountValue !== undefined) {
      if (offer.discountValue > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['discountValue'],
          message: 'PERCENT discountValue must be between 0 and 100',
        });
      }
    }
  });

export const voteSchema = z.enum(['WORKED', 'DIDNT_WORK']);

export const verificationReportSchema = z.object({
  id: z.string().min(1),
  offerId: z.string().min(1),
  vote: voteSchema,
  comment: z.string().max(500).optional(),
  anonId: z.string().min(1),
  createdAt: z.string().datetime(),
});

export const savedOfferRefSchema = z.object({
  offerId: z.string().min(1),
  savedAt: z.string().datetime(),
});
