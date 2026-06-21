import { useState } from 'react';
import { Card } from '@/components/dashboard/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BookingForm } from '@/components/bookings/BookingForm';
import { STATUS_LABELS, STATUS_STYLES } from '@/components/bookings/status';
import { bookingsOnDay, monthGrid } from '@/lib/bookings';
import { SERVICE_LABELS } from '@/lib/metrics';
import { formatAUD, formatWeekdayTime } from '@/lib/format';
import { now } from '@/data/mock';
import type { Booking, BookingStatus } from '@/types';
import type { StoreState } from '@/lib/store';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthLabel = new Intl.DateTimeFormat('en-AU', { month: 'long', year: 'numeric' });

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Status transitions offered for each current status.
const NEXT_STATUS: Partial<Record<BookingStatus, { label: string; to: BookingStatus }>> = {
  requested: { label: 'Confirm', to: 'confirmed' },
  confirmed: { label: 'Start stay', to: 'in_progress' },
  in_progress: { label: 'Complete', to: 'completed' },
};

export function Bookings({
  state,
  onAddBooking,
  onSetStatus,
  onDeleteBooking,
}: {
  state: StoreState;
  onAddBooking: (b: Omit<Booking, 'id'>) => void;
  onSetStatus: (id: string, status: BookingStatus) => void;
  onDeleteBooking: (id: string) => void;
}) {
  const [viewMonth, setViewMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date>(now);
  const [adding, setAdding] = useState(false);

  const grid = monthGrid(viewMonth);
  const clientName = (id: string) => state.clients.find((c) => c.id === id)?.name ?? 'Unknown';
  const dayBookings = bookingsOnDay(state.bookings, selectedDay);

  const shiftMonth = (delta: number) =>
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink dark:text-white">Bookings</h1>
          <p className="text-sm text-ink/60 dark:text-white/60">{state.bookings.length} total</p>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)}>
            <Icon name="calendar" className="h-4 w-4" /> New booking
          </Button>
        )}
      </div>

      {adding && (
        <Card title="New booking" className="mb-4">
          <BookingForm
            state={state}
            onCancel={() => setAdding(false)}
            onSubmit={(b) => {
              onAddBooking(b);
              setAdding(false);
              setSelectedDay(new Date(b.startAt));
            }}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title={monthLabel.format(viewMonth)}
          action={
            <div className="flex gap-1">
              <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)} className="grid h-8 w-8 place-items-center rounded-md text-ink/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10">
                <Icon name="chevron-right" className="h-4 w-4 rotate-180" />
              </button>
              <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)} className="grid h-8 w-8 place-items-center rounded-md text-ink/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10">
                <Icon name="chevron-right" className="h-4 w-4" />
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink/45 dark:text-white/45">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map(({ date, inMonth }) => {
              const dayItems = bookingsOnDay(state.bookings, date);
              const isToday = sameDay(date, now);
              const isSelected = sameDay(date, selectedDay);
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  onClick={() => setSelectedDay(date)}
                  aria-pressed={isSelected}
                  className={[
                    'flex min-h-[64px] flex-col rounded-lg border p-1 text-left transition',
                    isSelected ? 'border-brand-500 ring-1 ring-brand-500/40' : 'border-transparent hover:border-black/10 dark:hover:border-white/10',
                    inMonth ? 'bg-black/[0.02] dark:bg-white/[0.03]' : 'opacity-40',
                  ].join(' ')}
                >
                  <span className={['text-xs', isToday ? 'grid h-5 w-5 place-items-center rounded-full bg-brand-600 font-semibold text-white' : 'text-ink/60 dark:text-white/60'].join(' ')}>
                    {date.getDate()}
                  </span>
                  <span className="mt-0.5 flex flex-col gap-0.5">
                    {dayItems.slice(0, 2).map((b) => (
                      <span key={b.id} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${STATUS_STYLES[b.status]}`}>
                        {clientName(b.clientId)}
                      </span>
                    ))}
                    {dayItems.length > 2 && (
                      <span className="px-1 text-[10px] text-ink/45 dark:text-white/45">+{dayItems.length - 2} more</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title={selectedDay ? formatWeekdayTime(selectedDay.toISOString()).split(',')[0] + ' ' + selectedDay.getDate() : 'Day'}>
          {dayBookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/55 dark:text-white/55">No bookings on this day.</p>
          ) : (
            <ul className="space-y-3">
              {dayBookings.map((b) => {
                const next = NEXT_STATUS[b.status];
                return (
                  <li key={b.id} className="rounded-xl border border-black/5 p-3 dark:border-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink dark:text-white">{clientName(b.clientId)}</p>
                        <p className="text-xs text-ink/55 dark:text-white/55">{SERVICE_LABELS[b.service]} · {formatAUD(b.totalCents)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[b.status]}`}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {next && (
                        <Button variant="secondary" className="!px-2.5 !py-1 text-xs" onClick={() => onSetStatus(b.id, next.to)}>
                          {next.label}
                        </Button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <Button variant="ghost" className="!px-2.5 !py-1 text-xs" onClick={() => onSetStatus(b.id, 'cancelled')}>
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="!px-2.5 !py-1 text-xs text-rose-600 dark:text-rose-400"
                        onClick={() => {
                          if (window.confirm('Delete this booking?')) onDeleteBooking(b.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}
