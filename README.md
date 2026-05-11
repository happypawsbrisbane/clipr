# Coupon Scout AU

An Australian web app that helps shoppers find the best currently available coupons and sale offers, with a transparent reason why each offer ranks first.

**Status:** MVP scaffolding. Mock data only. No live integrations.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Zod for runtime validation
- Vitest for tests

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Run the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm test` | Run Vitest once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm typecheck` | TypeScript only |
| `pnpm lint` | ESLint |

## Project layout

- `app/` — Next.js App Router pages and route handlers
- `components/` — UI components
- `lib/` — Pure domain logic (types, schemas, ranking, loaders)
- `data/` — Mock JSON data (stores, offers, seed reports)
- `tests/` — Vitest unit tests

See `PRD.md` for product scope and `CLAUDE.md` for coding rules and compliance notes.
