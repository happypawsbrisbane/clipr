import type { BookingStatus } from '@/types';

// Shared presentation for booking statuses (used by the dashboard and the
// bookings page) so the colours and labels stay consistent.

export const STATUS_STYLES: Record<BookingStatus, string> = {
  requested: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  confirmed: 'bg-brand-50 text-brand-700 dark:bg-brand-400/15 dark:text-brand-200',
  in_progress: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  completed: 'bg-black/5 text-ink/60 dark:bg-white/10 dark:text-white/60',
  cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
