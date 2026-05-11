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

## Environment variables

Copy `.env.example` to `.env.local` for local development. The only optional variable today is:

- `ADMIN_PASSWORD` — enables the `/admin` moderation page. When unset, `/admin` renders a "disabled" notice.

On Vercel, set this in *Project Settings → Environment Variables*; don't commit `.env.local`.

## Deploying

### Vercel (recommended)

1. Push the repo to GitHub.
2. In Vercel, *Add New → Project* and import the repo. Framework is detected automatically (`vercel.json` pins it to Next.js + pnpm).
3. (Optional) Set `ADMIN_PASSWORD` in Project Settings → Environment Variables, then redeploy.
4. Click *Deploy*.

### Self-host

`pnpm build && pnpm start` produces a standard Next.js production server on port 3000. Drop it behind any reverse proxy.

### Continuous integration

`.github/workflows/ci.yml` runs typecheck + tests + build on every push to `main` and on every PR.

## Caveat: in-memory state on serverless

Three things in this MVP live in process memory, not a database:

- Verification reports (`/api/reports`)
- Admin offer-status overrides (`/admin`)
- Saved offers (per-browser `localStorage`, *not* server state — this one is fine)

On Vercel and other serverless hosts, each cold-started function instance starts with a fresh in-memory store. Votes and admin overrides will not be consistent across requests. This is acceptable for a mock-data MVP demo but **don't take real votes in production until the database swap lands** (each in-memory module is marked `TODO(future):`).

A single-process host like Render or Railway with no autoscaling will behave more predictably, but is still not durable across restarts.
