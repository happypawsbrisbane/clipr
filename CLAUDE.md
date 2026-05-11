# Project instructions

## Stack
- Next.js
- TypeScript
- Simple modular components
- Mock JSON data first
- Database-ready schema design

## Coding rules
- Plan before coding
- Keep file changes small
- Prefer readable over clever
- Add tests for ranking logic
- Do not invent live coupon results
- Mark all future integrations clearly

## UX
- Clean, trustworthy, minimal
- Mobile-first
- Australian audience
- Focus on clarity and verification

## Ranking integrity (non-negotiable)
- Ranking inputs must be pure and auditable; every ranked offer surfaces a `rankReason` to the user.
- Affiliate revenue, sponsorship, and any commercial signal MUST NOT be inputs to the ranking score. When affiliate integrations land later, they remain disclosure-only.
- Mock data and any future scraped data must carry an explicit `source` field; scraping must be reviewed against each retailer's ToS before enabling.

## Australian compliance notes
- Australian Consumer Law (ACL s18): no false or misleading representations. Use "estimated savings" language, not "guaranteed". Always show terms and a `lastVerifiedAt` timestamp on each offer.
- Privacy Act 1988 + APPs: v1 collects no PII. Verification reports use a cookie-scoped anonymous id only, documented on the public "How we rank" page.
- Email features (Spam Act 2003) are out of scope for v1.

## Future integrations
Mark all future integrations with `TODO(future):` comments. Do not stub functionality that isn't shipping in v1.
