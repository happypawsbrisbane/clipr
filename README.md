# PetSitter Pro

Premium pet-sitting software for boutique Australian operators — concierge-level
service for anxious, senior, and special-needs pets, not volume bookings.

**Status:** MVP scaffolding. The **Business Dashboard** is implemented as a real,
runnable React app on mock data; the backend (API, payments, auth) is mapped out
but not yet built. See [Roadmap](#roadmap).

## What's in this repo today

- A **Vite + React 18 + TypeScript + Tailwind** frontend.
- A fully built, responsive, dark-mode **Business Dashboard**: revenue, upcoming
  bookings, outstanding invoices, capacity utilisation, and a live activity feed.
- **Client & Pet management**: searchable client list, add clients, client detail
  with pet add/remove and care flags — working CRUD persisted to `localStorage`
  (validated with the AU phone helper), ready to swap for the API.
- A **Prisma schema** (`prisma/schema.prisma`) modelling the Phase 1 entities.
- Pure, testable business logic in `src/lib/` (metrics, AU formatting, ABN/phone
  validation).

The dashboard reads from `src/data/mock.ts`. Those shapes mirror `src/types.ts`
and the Prisma models, so swapping mock data for the real API will be mechanical.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS (shadcn/ui-ready)
- **Database (foundation):** PostgreSQL via Prisma (SQLite for local dev)
- **Planned backend:** Node + Express + TypeScript, Stripe (AUD), auth
- **Hosting target:** AWS Sydney or Vercel

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.

| Command | Purpose |
|---|---|
| `pnpm dev` | Run the Vite dev server |
| `pnpm build` | Type-check and produce a production build |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | TypeScript only |
| `pnpm lint` | ESLint |

## Project layout

- `src/pages/` — top-level pages (Dashboard, Clients, ClientDetail)
- `src/components/` — layout, dashboard, client, and shared UI components
- `src/lib/` — pure logic: `metrics`, `format` (AUD/GST/dates), `validation` (ABN, AU phone), `store` (CRUD), `useHashRoute`, theming
- `src/data/` — mock data (database-ready shapes)
- `src/types.ts` — domain types mirroring the Prisma schema
- `prisma/schema.prisma` — database schema foundation

## Australian specifics

- Currency in **AUD**, money stored as integer cents.
- **GST (10%)** computed and shown on invoices (`gstComponentCents`).
- **ABN** validation via the ATO checksum; **AU phone** validation (mobile + landline).
- Dates shown **DD/MM/YYYY**, times in **AEST/AEDT** (`Australia/Sydney`).
- Australian English throughout.

## Accessibility & UX

- Mobile-first layout (sitters work from phones in the field).
- Class-based **dark mode** with OS-preference detection and persistence.
- Semantic landmarks, visible focus rings, `aria-*` labels, and a screen-reader
  table mirroring the revenue chart — targeting WCAG 2.1 AA.

## Roadmap

Phase 1 (MVP) per the brief — build order: **database schema → API → frontend → Stripe → deploy**.

- [x] Database schema (Prisma)
- [x] Business Dashboard (frontend, mock data)
- [x] Client & Pet CRUD (frontend, localStorage-backed)
- [ ] Auth (sitter login)
- [ ] Express + Prisma API (swap the localStorage store for real persistence)
- [ ] Booking CRUD with calendar
- [ ] Client portal (read-only first)
- [ ] Photo uploads during bookings
- [ ] Invoice generation
- [ ] Stripe checkout (AUD)

All future integrations are marked with `TODO(future):` in code.
