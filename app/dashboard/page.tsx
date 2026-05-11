import Link from 'next/link';
import { SavedOffersList } from '@/components/SavedOffersList';
import { loadOffers, loadStores } from '@/lib/data';

export const metadata = { title: 'Saved offers · Coupon Scout AU' };

export default function DashboardPage() {
  const offers = loadOffers();
  const stores = loadStores();

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Saved offers</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Saved offers</h1>
        <p className="mt-2 text-sm text-slate-600">
          Stored in this browser only. No account needed.
        </p>
      </header>

      <section className="mt-8">
        <SavedOffersList offers={offers} stores={stores} />
      </section>
    </main>
  );
}
