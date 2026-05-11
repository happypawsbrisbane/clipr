import Link from 'next/link';

export const metadata = { title: 'How we rank · Coupon Scout AU' };

export default function HowWeRankPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">How we rank</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">How we rank offers</h1>
        <p className="mt-2 text-sm text-slate-600">
          A transparent explanation of why each offer ranks where it does.
        </p>
      </header>

      <section className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed">
        <h2 className="mt-6 text-lg font-semibold">What we score</h2>
        <p className="mt-2 text-slate-700">
          Every active offer is scored by a single pure function that combines five signals:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          <li>
            <strong>Estimated value (40%)</strong> — how much the offer can save you on a typical
            $100 basket. Percentage discounts, fixed dollar amounts, free shipping, and
            buy-one-get-one offers are normalised so they can be compared.
          </li>
          <li>
            <strong>Verification (25%)</strong> — what fraction of users have reported the offer
            still works. We use the Wilson lower-bound at 95% confidence so a 3-of-3 streak
            doesn&apos;t outrank a 95-of-100 history.
          </li>
          <li>
            <strong>Freshness (20%)</strong> — exponential decay on when we last verified the
            offer, with a half-life of about two weeks.
          </li>
          <li>
            <strong>Source trust (10%)</strong> — manually curated entries score higher than
            mock or community-listed entries.
          </li>
          <li>
            <strong>Urgency (5%)</strong> — a small boost for offers expiring within 24 hours.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold">What we don&apos;t score on</h2>
        <p className="mt-2 text-slate-700">
          Affiliate revenue, sponsorship, or any commercial relationship with a retailer is{' '}
          <strong>never</strong> a ranking input. If we ever introduce affiliate links they will
          remain a disclosure label only, separate from the score.
        </p>

        <h2 className="mt-8 text-lg font-semibold">Estimates, not guarantees</h2>
        <p className="mt-2 text-slate-700">
          Discounts shown are estimates. The actual amount you save depends on your cart, the
          retailer&apos;s terms, and any exclusions on the offer. We always show the offer terms
          and the date we last verified it.
        </p>

        <h2 className="mt-8 text-lg font-semibold">Verification reports</h2>
        <p className="mt-2 text-slate-700">
          When you tap <em>Worked</em> or <em>Didn&apos;t work</em> we record your vote against an
          anonymous browser cookie (<code>csa_aid</code>). We use that cookie only to stop the
          same browser from voting twice on the same offer. We don&apos;t collect your email,
          name, or any other personal information in v1.
        </p>

        <h2 className="mt-8 text-lg font-semibold">Data sources</h2>
        <p className="mt-2 text-slate-700">
          This MVP uses mock data only — no scraping, no live affiliate feeds, no email
          notifications. When real data sources arrive each offer will continue to carry an
          explicit source field so you can see how we got it.
        </p>
      </section>

      <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Back to home
        </Link>
      </footer>
    </main>
  );
}
