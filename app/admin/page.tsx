import Link from 'next/link';
import { isAdmin, isAdminConfigured } from '@/lib/admin-auth';
import { getOffers, loadOffers, loadStores } from '@/lib/data';
import { getStatusOverride } from '@/lib/offers-overrides';
import { adminLoginAction, adminLogoutAction, setOfferStatusAction } from '@/app/admin/actions';
import type { OfferStatus } from '@/lib/types';

export const metadata = { title: 'Admin · Coupon Scout AU' };
export const dynamic = 'force-dynamic';

const STATUS_OPTIONS: OfferStatus[] = ['ACTIVE', 'PENDING', 'EXPIRED', 'REMOVED'];

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  if (!isAdminConfigured()) {
    return (
      <Shell>
        <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Admin moderation is disabled. Set the <code>ADMIN_PASSWORD</code> environment variable
          and restart to enable it.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <form
          action={adminLoginAction}
          className="max-w-sm space-y-3 rounded-lg border border-hairline bg-paper p-5 shadow-sm"
        >
          <label htmlFor="password" className="block text-sm font-medium">
            Admin password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-hairline px-3 py-2 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          {error === 'invalid' && (
            <p className="text-sm text-rose-600">Incorrect password.</p>
          )}
          <button
            type="submit"
            className="bg-ink px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      </Shell>
    );
  }

  const offers = getOffers();
  const stores = loadStores();
  const storeName = new Map(stores.map((s) => [s.id, s.name] as const));

  const grouped: Record<OfferStatus, typeof offers> = {
    ACTIVE: [],
    PENDING: [],
    EXPIRED: [],
    REMOVED: [],
  };
  for (const o of offers) grouped[o.status].push(o);

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">
          Signed in. Status changes apply in-memory and reset on deploy.
        </p>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="text-sm text-mute underline-offset-4 hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-8">
        {STATUS_OPTIONS.map((status) => (
          <section key={status}>
            <h2 className="text-lg font-semibold">
              {status} <span className="ml-2 text-sm font-normal text-mute">({grouped[status].length})</span>
            </h2>
            {grouped[status].length === 0 ? (
              <p className="mt-2 text-sm text-mute">No offers.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {grouped[status].map((offer) => {
                  const override = getStatusOverride(offer.id);
                  return (
                    <li
                      key={offer.id}
                      className="rounded-md border border-hairline bg-paper p-3 text-sm"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wide text-mute">
                            {storeName.get(offer.storeId) ?? offer.storeId}
                          </p>
                          <p className="font-medium">{offer.title}</p>
                          {override && (
                            <p className="mt-1 text-xs text-amber-700">
                              Overridden (originally{' '}
                              {loadOriginalStatus(offer.id) ?? '—'})
                            </p>
                          )}
                        </div>
                        <form
                          action={setOfferStatusAction}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <input type="hidden" name="offerId" value={offer.id} />
                          <select
                            name="status"
                            defaultValue={offer.status}
                            aria-label={`Set status for ${offer.title}`}
                            className="rounded-md border border-hairline px-2 py-1 text-sm"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="rounded-md border border-hairline bg-paper px-3 py-1 text-sm font-medium hover:border-accent"
                          >
                            Apply
                          </button>
                          {override && (
                            <button
                              type="submit"
                              name="status"
                              value="RESET"
                              className="text-xs text-mute underline-offset-4 hover:underline"
                            >
                              Reset
                            </button>
                          )}
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <nav className="text-sm text-mute">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Admin</span>
      </nav>
      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin moderation</h1>
        <p className="mt-2 text-sm text-mute">
          v1: status changes are stored in memory only.
        </p>
      </header>
      <section className="mt-6">{children}</section>
    </main>
  );
}

function loadOriginalStatus(offerId: string): OfferStatus | undefined {
  return loadOffers().find((o) => o.id === offerId)?.status;
}
