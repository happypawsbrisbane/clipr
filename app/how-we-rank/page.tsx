import Link from 'next/link';

export const metadata = { title: 'How we rank · Coupon Scout AU' };

export default function HowWeRankPage() {
  return (
    <main className="mx-auto max-w-[720px] px-5 pb-20 pt-10">
      <nav className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">How we rank</span>
      </nav>

      <header className="mt-6">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
          How we rank offers
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          A transparent explanation of why each offer ranks where it does.
        </p>
      </header>

      <section className="mt-10 max-w-none text-[15px] leading-relaxed text-ink">
        <h2 className="font-serif text-2xl text-ink">What we score</h2>
        <p className="mt-3 text-mute">
          Every active offer is scored by a single pure function that combines five signals:
        </p>
        <ul className="mt-4 space-y-3 text-mute">
          <li>
            <strong className="text-ink">Estimated value (40%)</strong> — how much the offer can
            save you on a typical $100 basket. Percentage discounts, fixed dollar amounts, free
            shipping, and buy-one-get-one offers are normalised so they can be compared.
          </li>
          <li>
            <strong className="text-ink">Verification (25%)</strong> — what fraction of users have
            reported the offer still works. We use the Wilson lower-bound at 95% confidence so a
            3-of-3 streak doesn&apos;t outrank a 95-of-100 history.
          </li>
          <li>
            <strong className="text-ink">Freshness (20%)</strong> — exponential decay on when we
            last verified the offer, with a half-life of about two weeks.
          </li>
          <li>
            <strong className="text-ink">Source trust (10%)</strong> — manually curated entries
            score higher than mock or community-listed entries.
          </li>
          <li>
            <strong className="text-ink">Urgency (5%)</strong> — a small boost for offers expiring
            within 24 hours.
          </li>
        </ul>

        <h2 className="mt-12 font-serif text-2xl text-ink">What we don&apos;t score on</h2>
        <p className="mt-3 text-mute">
          Affiliate revenue, sponsorship, or any commercial relationship with a retailer is{' '}
          <strong className="text-ink">never</strong> a ranking input. The same ranking function
          runs whether an offer has an affiliate link or not, and a regression test in our
          codebase asserts that adding an affiliate URL to an offer leaves its score and position
          unchanged.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-ink">Affiliate links</h2>
        <p className="mt-3 text-mute">
          Some &ldquo;Shop at &hellip;&rdquo; buttons send you to the retailer through an
          affiliate network (AWIN, CJ, Rakuten, Impact). When that&apos;s the case the button
          carries a visible <em>Affiliate link</em> label and we may earn a small commission if
          you buy something. We use the same anonymous browser cookie (
          <code className="bg-accent-soft px-1 font-mono text-[13px]">csa_aid</code>) to track
          outbound clicks for attribution.
        </p>
        <p className="mt-3 text-mute">
          You are never required to click an affiliate link. Every offer also shows the
          retailer&apos;s name, the offer code (where applicable), and the offer terms, so you
          can navigate to the retailer directly if you prefer.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-ink">Estimates, not guarantees</h2>
        <p className="mt-3 text-mute">
          Discounts shown are estimates. The actual amount you save depends on your cart, the
          retailer&apos;s terms, and any exclusions on the offer. We always show the offer terms
          and the date we last verified it.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-ink">Verification reports</h2>
        <p className="mt-3 text-mute">
          When you tap <em>Worked</em> or <em>Didn&apos;t work</em> we record your vote against an
          anonymous browser cookie (
          <code className="bg-accent-soft px-1 font-mono text-[13px]">csa_aid</code>). We use that
          cookie only to stop the same browser from voting twice on the same offer. We don&apos;t
          collect your email, name, or any other personal information in v1.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-ink">Data sources</h2>
        <p className="mt-3 text-mute">
          This MVP uses mock data only — no scraping, no live affiliate feeds, no email
          notifications. When real data sources arrive each offer will continue to carry an
          explicit source field so you can see how we got it.
        </p>
      </section>

      <footer className="mt-16 border-t border-hairline pt-6 font-sans text-[11px] font-medium uppercase tracking-meta">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Back to home
        </Link>
      </footer>
    </main>
  );
}
