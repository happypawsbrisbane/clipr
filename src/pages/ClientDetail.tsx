import { useState } from 'react';
import { Card } from '@/components/dashboard/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PetForm } from '@/components/clients/PetForm';
import { petsForClient, type StoreState } from '@/lib/store';
import { formatDate } from '@/lib/format';
import type { Pet } from '@/types';

export function ClientDetail({
  state,
  clientId,
  onAddPet,
  onDeletePet,
  onDeleteClient,
  onBack,
}: {
  state: StoreState;
  clientId: string;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
  onDeletePet: (id: string) => void;
  onDeleteClient: (id: string) => void;
  onBack: () => void;
}) {
  const client = state.clients.find((c) => c.id === clientId);
  const [addingPet, setAddingPet] = useState(false);

  if (!client) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Card>
          <p className="text-sm text-ink/60 dark:text-white/60">This client no longer exists.</p>
          <Button variant="secondary" className="mt-3" onClick={onBack}>
            Back to clients
          </Button>
        </Card>
      </main>
    );
  }

  const pets = petsForClient(state, clientId);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
      >
        <Icon name="chevron-right" className="h-4 w-4 rotate-180" /> Clients
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Client" className="lg:col-span-1">
          <p className="text-lg font-semibold text-ink dark:text-white">{client.name}</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink/55 dark:text-white/55">Suburb</dt>
              <dd className="text-right text-ink dark:text-white/90">{client.suburb || '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink/55 dark:text-white/55">Client since</dt>
              <dd className="text-right text-ink dark:text-white/90">{formatDate(client.since)}</dd>
            </div>
          </dl>
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => {
              if (window.confirm(`Remove ${client.name} and their pets?`)) {
                onDeleteClient(client.id);
                onBack();
              }
            }}
          >
            Remove client
          </Button>
        </Card>

        <div className="lg:col-span-2">
          <Card
            title={`Pets (${pets.length})`}
            action={
              !addingPet ? (
                <Button variant="secondary" onClick={() => setAddingPet(true)}>
                  <Icon name="paw" className="h-4 w-4" /> Add pet
                </Button>
              ) : undefined
            }
          >
            {addingPet && (
              <div className="mb-4 rounded-xl bg-brand-50 p-4 dark:bg-white/5">
                <PetForm
                  submitLabel="Add pet"
                  onCancel={() => setAddingPet(false)}
                  onSubmit={(v) => {
                    onAddPet({ clientId, name: v.name, species: v.species, breed: v.breed, careFlags: v.careFlags });
                    setAddingPet(false);
                  }}
                />
              </div>
            )}

            {pets.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink/55 dark:text-white/55">No pets recorded yet.</p>
            ) : (
              <ul className="divide-y divide-black/5 dark:divide-white/10">
                {pets.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">
                      <Icon name="paw" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink dark:text-white">
                        {p.name} <span className="font-normal capitalize text-ink/50 dark:text-white/50">· {p.species}{p.breed ? ` · ${p.breed}` : ''}</span>
                      </p>
                      {p.careFlags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.careFlags.map((f) => (
                            <span key={f} className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => onDeletePet(p.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
