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
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:migrate` | Apply new migrations (dev) |
| `pnpm db:seed` | Load data/reports.seed.json into the DB |

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

## Persistence

**Verification reports** persist to a database when `DATABASE_URL` is set. The repo ships with a Prisma schema (SQLite for local dev, Postgres-compatible for prod). One vote per `(offerId, anonId)` is enforced by a unique index.

Local setup (one-time, SQLite):

```bash
cp .env.example .env.local
# set DATABASE_URL="file:./dev.db" inside .env.local
pnpm db:migrate      # creates prisma/dev.db with the schema
pnpm db:seed         # loads data/reports.seed.json (15 sample reports)
pnpm dev
```

Production (Postgres):

1. Provision Postgres (Vercel Postgres, Neon, Supabase, Railway, …).
2. Switch the datasource provider in `prisma/schema.prisma` from `sqlite` to `postgresql`.
3. Set `DATABASE_URL` in your host's environment.
4. The `postinstall` script runs `prisma generate` automatically. Run `prisma migrate deploy` as part of your release step.

When `DATABASE_URL` is unset the app falls back to an in-memory store seeded from `data/reports.seed.json` — fine for unit tests and local prototyping, but votes evaporate on restart.

## Still in-memory (TODO: persist)

Two pieces still live in process memory and reset on restart / cold start:

- Admin offer-status overrides (`/admin`)
- Outbound click counts (`/api/click/[offerId]`)

Both are admin/analytics signals rather than user-facing trust signals, so they're lower priority than reports. Each is marked `TODO(future):` in code.

Saved offers (`/dashboard`) live in per-browser `localStorage` and are unaffected by server restarts.
