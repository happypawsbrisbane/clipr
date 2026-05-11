export type Country = 'AU';

export type StoreCategory =
  | 'fashion'
  | 'tech'
  | 'food'
  | 'home'
  | 'beauty'
  | 'travel'
  | 'sport'
  | 'kids'
  | 'other';

export interface Store {
  id: string;
  slug: string;
  name: string;
  category: StoreCategory;
  country: Country;
  logoUrl: string;
  coverImageUrl: string;
  websiteUrl: string;
  createdAt: string;
}

// CASHBACK is reserved for a future phase; not produced or accepted in v1.
export type OfferType = 'CODE' | 'DEAL' | 'SALE';

export type DiscountType = 'PERCENT' | 'FIXED' | 'FREE_SHIPPING' | 'BOGO' | 'OTHER';

export type OfferStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'REMOVED';

// SCRAPED and AFFILIATE are reserved for future phases.
export type OfferSource = 'MOCK' | 'MANUAL';

export interface Offer {
  id: string;
  storeId: string;
  type: OfferType;
  title: string;
  description: string;
  code?: string;
  discountType: DiscountType;
  discountValue?: number;
  minSpend?: number;
  startsAt: string;
  expiresAt?: string;
  terms?: string;
  status: OfferStatus;
  source: OfferSource;
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type Vote = 'WORKED' | 'DIDNT_WORK';

export interface VerificationReport {
  id: string;
  offerId: string;
  vote: Vote;
  comment?: string;
  anonId: string;
  createdAt: string;
}

export interface SavedOfferRef {
  offerId: string;
  savedAt: string;
}
