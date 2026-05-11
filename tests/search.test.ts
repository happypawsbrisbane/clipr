import { describe, expect, it } from 'vitest';
import { searchStores } from '@/lib/search';
import type { Store } from '@/lib/types';

const stores: Store[] = [
  {
    id: '1',
    slug: 'jb-hi-fi',
    name: 'JB Hi-Fi',
    category: 'tech',
    country: 'AU',
    logoUrl: 'https://example.com/jb.png',
    websiteUrl: 'https://example.com/jb',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    slug: 'cotton-on',
    name: 'Cotton On',
    category: 'fashion',
    country: 'AU',
    logoUrl: 'https://example.com/co.png',
    websiteUrl: 'https://example.com/co',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    slug: 'kogan',
    name: 'Kogan',
    category: 'tech',
    country: 'AU',
    logoUrl: 'https://example.com/k.png',
    websiteUrl: 'https://example.com/k',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('searchStores', () => {
  it('returns nothing for an empty query', () => {
    expect(searchStores('', stores)).toEqual([]);
    expect(searchStores('   ', stores)).toEqual([]);
  });

  it('matches by store name, case-insensitively', () => {
    const r = searchStores('cotton', stores);
    expect(r.map((s) => s.id)).toEqual(['2']);
  });

  it('matches by category', () => {
    const r = searchStores('tech', stores);
    expect(r.map((s) => s.id).sort()).toEqual(['1', '3']);
  });

  it('returns empty when nothing matches', () => {
    expect(searchStores('nothingreal', stores)).toEqual([]);
  });
});
