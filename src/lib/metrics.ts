// Pure dashboard calculations. Kept free of React so they stay easy to test and
// to move server-side later.

import type { Booking, Invoice, RevenuePoint, ServiceType } from '@/types';

export const SERVICE_LABELS: Record<ServiceType, string> = {
  overnight: 'Overnight stay',
  drop_in: 'Drop-in visit',
  day_care: 'Day care',
  dog_walking: 'Dog walking',
};

/** Bookings that haven't finished yet, soonest first. */
export function upcomingBookings(bookings: Booking[], from: Date): Booking[] {
  return bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'completed')
    .filter((b) => new Date(b.endAt) >= from)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

/** Total outstanding across sent + overdue invoices (cents). */
export function outstandingTotalCents(invoices: Invoice[]): number {
  return invoices
    .filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.totalCents, 0);
}

export function overdueInvoices(invoices: Invoice[], asOf: Date): Invoice[] {
  return invoices
    .filter((i) => i.status === 'overdue' || (i.status === 'sent' && new Date(i.dueDate) < asOf))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/** Revenue booked in the calendar month containing `asOf` (cents). */
export function revenueThisMonthCents(bookings: Booking[], asOf: Date): number {
  return bookings
    .filter((b) => b.status !== 'cancelled')
    .filter((b) => {
      const d = new Date(b.startAt);
      return d.getFullYear() === asOf.getFullYear() && d.getMonth() === asOf.getMonth();
    })
    .reduce((sum, b) => sum + b.totalCents, 0);
}

/**
 * Capacity utilisation for the next `days` nights. A boutique sitter has a small
 * number of overnight slots; this is the share that is booked.
 */
export function capacityUtilisation(
  bookings: Booking[],
  from: Date,
  days: number,
  nightlyCapacity: number,
): { bookedNights: number; totalNights: number; pct: number } {
  const totalNights = days * nightlyCapacity;
  const horizonEnd = new Date(from);
  horizonEnd.setDate(horizonEnd.getDate() + days);

  let bookedNights = 0;
  for (const b of bookings) {
    if (b.service !== 'overnight' || b.status === 'cancelled') continue;
    const start = new Date(Math.max(new Date(b.startAt).getTime(), from.getTime()));
    const end = new Date(Math.min(new Date(b.endAt).getTime(), horizonEnd.getTime()));
    if (end <= start) continue;
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    bookedNights += nights;
  }

  const pct = totalNights === 0 ? 0 : Math.min(100, Math.round((bookedNights / totalNights) * 100));
  return { bookedNights, totalNights, pct };
}

/** Month-over-month revenue change as a signed percentage. */
export function momChangePct(series: RevenuePoint[]): number | null {
  if (series.length < 2) return null;
  const prev = series[series.length - 2].amountCents;
  const curr = series[series.length - 1].amountCents;
  if (prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}
