import Link from 'next/link';
import { SavedOffersList } from '@/components/SavedOffersList';
import { getOffers, loadStores } from '@/lib/data';

export const metadata = { title: 'Saved offers · Coupon Scout AU' };
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const offers = getOffers();
  const stores = loadStores();

  return (
    <main className="mx-auto max-w-[720px] px-5 pb-20 pt-10">
      <nav className="font-sans text-[11px] font-medium uppercase tracking-meta text-mute">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">Saved offers</span>
      </nav>

      <header className="mt-6">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">Saved offers</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Stored in this browser only. No account needed.
        </p>
      </header>

      <section className="mt-10">
        <SavedOffersList offers={offers} stores={stores} />
      </section>
    </main>
  );
}
