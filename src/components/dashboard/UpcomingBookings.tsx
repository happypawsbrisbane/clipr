import { Card } from './Card';
import { Icon } from '@/components/ui/Icon';
import { SERVICE_LABELS } from '@/lib/metrics';
import { formatAUD, formatWeekdayTime } from '@/lib/format';
import { clientById, petById } from '@/data/mock';
import { STATUS_LABELS, STATUS_STYLES } from '@/components/bookings/status';
import type { Booking } from '@/types';

function petNames(booking: Booking): string {
  return booking.petIds.map((id) => petById(id)?.name ?? 'Pet').join(' & ');
}

export function UpcomingBookings({ bookings }: { bookings: Booking[] }) {
  return (
    <Card
      title="Upcoming bookings"
      action={
        <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-300">
          View calendar <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </a>
      }
    >
      <ul className="divide-y divide-black/5 dark:divide-white/10">
        {bookings.map((b) => {
          const client = clientById(b.clientId);
          return (
            <li key={b.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">
                <Icon name="paw" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink dark:text-white">
                  {petNames(b)} <span className="font-normal text-ink/50 dark:text-white/50">· {client?.name}</span>
                </p>
                <p className="truncate text-xs text-ink/55 dark:text-white/55">
                  {SERVICE_LABELS[b.service]} · {formatWeekdayTime(b.startAt)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold text-ink dark:text-white">{formatAUD(b.totalCents)}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
