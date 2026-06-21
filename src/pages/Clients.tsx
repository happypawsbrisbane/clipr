import { useMemo, useState } from 'react';
import { Card } from '@/components/dashboard/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ClientForm } from '@/components/clients/ClientForm';
import { petsForClient, type StoreState } from '@/lib/store';
import type { Client } from '@/types';

export function Clients({
  state,
  onAddClient,
  onOpenClient,
}: {
  state: StoreState;
  onAddClient: (c: Omit<Client, 'id'>) => void;
  onOpenClient: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.clients;
    return state.clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.suburb.toLowerCase().includes(q),
    );
  }, [state.clients, query]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink dark:text-white">Clients</h1>
          <p className="text-sm text-ink/60 dark:text-white/60">{state.clients.length} on the roster</p>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)}>
            <Icon name="users" className="h-4 w-4" /> Add client
          </Button>
        )}
      </div>

      {adding && (
        <Card title="New client" className="mb-4">
          <ClientForm
            submitLabel="Add client"
            onCancel={() => setAdding(false)}
            onSubmit={(v) => {
              onAddClient({ name: v.name, suburb: v.suburb, since: new Date().toISOString().slice(0, 10) });
              setAdding(false);
            }}
          />
        </Card>
      )}

      <Card>
        <label className="relative mb-4 flex items-center">
          <span className="sr-only">Search clients</span>
          <Icon name="search" className="pointer-events-none absolute left-3 h-4 w-4 text-ink/40 dark:text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or suburb…"
            className="w-full rounded-lg border border-black/10 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
          />
        </label>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/55 dark:text-white/55">No clients match “{query}”.</p>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {filtered.map((c) => {
              const petCount = petsForClient(state, c.id).length;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onOpenClient(c.id)}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">
                      <Icon name="users" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink dark:text-white">{c.name}</p>
                      <p className="truncate text-xs text-ink/55 dark:text-white/55">{c.suburb || '—'}</p>
                    </div>
                    <span className="text-xs text-ink/55 dark:text-white/55">
                      {petCount} {petCount === 1 ? 'pet' : 'pets'}
                    </span>
                    <Icon name="chevron-right" className="h-4 w-4 text-ink/30 dark:text-white/30" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </main>
  );
}
