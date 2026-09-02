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

## Imagery

Photography lives in `public/images/` and is wired up in two places:

- **Products** — each entry in `src/lib/catalogue.ts` has an `images.still` (the
  product on its own) and an optional `images.worn` (the second view, shown on
  hover). Both take a `src` and a `tone`, the ground colour painted behind the
  photograph.
- **Sections** — the hero, campaign panels, category cards and community strip
  pass their own `src` to the `Frame` component.

`Frame` (`src/components/Frame.tsx`) falls back to a flat brand-tone panel with
grain and a caption when no `src` is given, so a slot awaiting a photograph
still reads as intended rather than collapsing.

The hero is art-directed per breakpoint: `hero-mobile.jpg` (vertical) below the
`md` breakpoint, `hero-desktop.jpg` (wide, subject right) above it.

## Layout

- `src/app/` – layout, page, global styles and theme tokens
- `src/components/` – sections and UI (header, cart drawer, quick view, search, etc.)
- `src/lib/` – catalogue, money formatting, cart and UI state, dialog helpers
