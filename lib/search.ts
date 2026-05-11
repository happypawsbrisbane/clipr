import type { Store } from '@/lib/types';

// TODO(future): swap this naive matcher for Fuse.js once we have real store
// counts and need typo-tolerance. Keep the signature stable so the page
// doesn't change.
export function searchStores(query: string, stores: Store[]): Store[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return stores.filter(
    (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
  );
}
