# GOOD SORT

Storefront prototype for GOOD SORT, Australian wearables for dogs & humans. Est. 2024.

This is a self-contained app that lives alongside PetSitter Pro in this repository. It has its
own dependencies and build; run every command from this `good-sort/` directory.

Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion. Single homepage with a
working cart, quick view, search, collection filtering and a "shop the walk" set builder. All
commerce state is client-side; there is no checkout backend yet.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

| Command          | Purpose                           |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Dev server                        |
| `pnpm build`     | Production build (also type-checks) |
| `pnpm typecheck` | TypeScript only                   |

## Replacing the temporary imagery

Campaign photography was not available when this was built. Every image slot renders a flat
brand-colour panel with a fine grain, the interlocking "OO" mark and a caption. To swap in a
photograph, pass a `src` to the `Frame` component (see `src/components/Frame.tsx`). Product
imagery is keyed in `src/lib/catalogue.ts` under each product's `images` field.

## Layout

- `src/app/` – layout, page, global styles and theme tokens
- `src/components/` – sections and UI (header, cart drawer, quick view, search, etc.)
- `src/lib/` – catalogue, money formatting, cart and UI state, dialog helpers
