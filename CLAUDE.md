# Project instructions — PetSitter Pro

Premium pet-sitting software for boutique Australian operators (concierge-level
service for anxious, senior, and special-needs pets). High-touch, low-volume.

## Stack
- React 18 + TypeScript + Vite + TailwindCSS (shadcn/ui-ready)
- Prisma + PostgreSQL (SQLite for local dev)
- Planned backend: Node + Express + TypeScript, Stripe (AUD)
- Mock JSON/TS data first; database-ready schema design

## Coding rules
- Plan before coding
- Keep file changes small
- Prefer readable over clever
- Pure business/calculation logic lives in `src/lib/` and stays React-free so it
  is easy to test and to move server-side
- Add tests for money/GST, capacity, and validation logic
- Mark all future integrations clearly with `TODO(future):` — do not stub
  functionality that isn't shipping in the current phase

## UX
- Clean, premium aesthetic (not clinical or generic)
- Mobile-first (sitters use phones in the field)
- Dark mode support (class-based, OS-aware)
- Accessible — target WCAG 2.1 AA (landmarks, focus rings, aria labels)
- Australian English throughout

## Australian compliance & conventions (non-negotiable)
- Currency in **AUD**; store money as integer **cents**, format at the edge
- **GST (10%)** calculated and displayed on invoices
- **ABN** on business settings/invoices; validate with the ATO checksum
- Australian phone validation (mobile + landline)
- Dates **DD/MM/YYYY**; times in **AEST/AEDT** (`Australia/Sydney`)
- Privacy: collect only what's needed; never commit secrets (use `.env`)

## Build order (Phase 1 MVP)
Database schema → API → frontend → Stripe → deploy. The dashboard frontend is
built ahead of the API against `src/data/mock.ts`, whose shapes mirror the Prisma
models so the swap is mechanical.
