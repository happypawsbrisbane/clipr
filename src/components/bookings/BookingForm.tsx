import { useMemo, useState } from 'react';
import { FieldShell } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { SERVICE_LABELS } from '@/lib/metrics';
import { findConflicts } from '@/lib/bookings';
import { petsForClient, type StoreState } from '@/lib/store';
import { formatDayMonth } from '@/lib/format';
import type { Booking, ServiceType } from '@/types';

const SERVICES: ServiceType[] = ['overnight', 'drop_in', 'day_care', 'dog_walking'];

const selectClass =
  'w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white';

/** Converts a datetime-local value ("2026-06-18T16:00") to an ISO string. */
function toISO(localValue: string): string {
  return new Date(localValue).toISOString();
}

export function BookingForm({
  state,
  onSubmit,
  onCancel,
}: {
  state: StoreState;
  onSubmit: (booking: Omit<Booking, 'id'>) => void;
  onCancel: () => void;
}) {
  const [clientId, setClientId] = useState(state.clients[0]?.id ?? '');
  const [service, setService] = useState<ServiceType>('overnight');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [price, setPrice] = useState('');
  const [petIds, setPetIds] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  const clientPets = clientId ? petsForClient(state, clientId) : [];

  const conflicts = useMemo(() => {
    if (!start || !end) return [];
    return findConflicts(state.bookings, { startAt: toISO(start), endAt: toISO(end), service });
  }, [state.bookings, start, end, service]);

  const togglePet = (id: string) =>
    setPetIds((ids) => (ids.includes(id) ? ids.filter((p) => p !== id) : [...ids, id]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return setError('Choose a client.');
    if (!start || !end) return setError('Set a start and end time.');
    if (toISO(end) <= toISO(start)) return setError('End time must be after the start time.');
    const dollars = Number(price);
    if (!Number.isFinite(dollars) || dollars < 0) return setError('Enter a valid price.');

    onSubmit({
      clientId,
      petIds: petIds.length ? petIds : clientPets.map((p) => p.id),
      service,
      status: 'confirmed',
      startAt: toISO(start),
      endAt: toISO(end),
      totalCents: Math.round(dollars * 100),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FieldShell label="Client" htmlFor="booking-client">
        <select
          id="booking-client"
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            setPetIds([]);
          }}
          className={selectClass}
        >
          {state.clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell label="Service" htmlFor="booking-service">
        <select id="booking-service" value={service} onChange={(e) => setService(e.target.value as ServiceType)} className={selectClass}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {SERVICE_LABELS[s]}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell label="Starts" htmlFor="booking-start">
        <input id="booking-start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className={selectClass} />
      </FieldShell>

      <FieldShell label="Ends" htmlFor="booking-end">
        <input id="booking-end" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className={selectClass} />
      </FieldShell>

      <FieldShell label="Total price (AUD, incl. GST)" htmlFor="booking-price" hint="e.g. 1240">
        <input id="booking-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={selectClass} />
      </FieldShell>

      {clientPets.length > 0 && (
        <FieldShell label="Pets" htmlFor="booking-pets" hint="Leave empty to include all of the client's pets">
          <div id="booking-pets" className="flex flex-wrap gap-2 pt-1">
            {clientPets.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => togglePet(p.id)}
                aria-pressed={petIds.includes(p.id)}
                className={[
                  'rounded-full px-3 py-1 text-xs font-medium transition',
                  petIds.includes(p.id)
                    ? 'bg-brand-600 text-white'
                    : 'bg-black/5 text-ink/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70',
                ].join(' ')}
              >
                {p.name}
              </button>
            ))}
          </div>
        </FieldShell>
      )}

      {conflicts.length > 0 && (
        <div
          role="alert"
          className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/15 dark:text-amber-200 sm:col-span-2"
        >
          ⚠ Overlaps an existing overnight stay (
          {conflicts.map((c) => `${formatDayMonth(c.startAt)}–${formatDayMonth(c.endAt)}`).join(', ')}
          ). You can still save it.
        </div>
      )}

      {error && <p className="text-xs text-rose-600 dark:text-rose-400 sm:col-span-2">{error}</p>}

      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit">Add booking</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
