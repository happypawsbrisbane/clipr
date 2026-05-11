import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = { title: 'Search · Coupon Scout AU' };

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Search</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Search stores</h1>
        <p className="mt-2 text-sm text-slate-600">
          Find Australian stores by name or category.
        </p>
      </header>

      <section className="mt-6">
        <SearchBar defaultValue={q} />
      </section>

      <p className="mt-8 rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Search results land in the next phase. Try the {' '}
        <Link href="/stores" className="text-accent underline-offset-4 hover:underline">
          stores directory
        </Link>{' '}
        in the meantime.
      </p>
    </main>
  );
}
