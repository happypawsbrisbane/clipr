import { describe, expect, it } from 'vitest';
import {
  capacityUtilisation,
  momChangePct,
  outstandingTotalCents,
  revenueThisMonthCents,
  upcomingBookings,
} from './metrics';
import type { Booking, Invoice, RevenuePoint } from '@/types';

const now = new Date('2026-06-17T09:00:00+10:00');

const booking = (over: Partial<Booking>): Booking => ({
  id: 'b', clientId: 'c', petIds: ['p'], service: 'overnight', status: 'confirmed',
  startAt: '2026-06-18T16:00:00+10:00', endAt: '2026-06-20T10:00:00+10:00', totalCents: 50000,
  ...over,
});

describe('upcomingBookings', () => {
  it('excludes cancelled/completed and sorts by start', () => {
    const list = [
      booking({ id: 'late', startAt: '2026-06-25T16:00:00+10:00', endAt: '2026-06-26T10:00:00+10:00' }),
      booking({ id: 'soon' }),
      booking({ id: 'done', status: 'completed' }),
      booking({ id: 'gone', status: 'cancelled' }),
    ];
    expect(upcomingBookings(list, now).map((b) => b.id)).toEqual(['soon', 'late']);
  });
});

describe('outstandingTotalCents', () => {
  it('sums sent + overdue only', () => {
    const invoices: Invoice[] = [
      { id: '1', number: 'A', clientId: 'c', bookingId: 'b', status: 'sent', totalCents: 1000, dueDate: '2026-06-20' },
      { id: '2', number: 'B', clientId: 'c', bookingId: 'b', status: 'overdue', totalCents: 2000, dueDate: '2026-06-01' },
      { id: '3', number: 'C', clientId: 'c', bookingId: 'b', status: 'paid', totalCents: 9999, dueDate: '2026-06-01' },
    ];
    expect(outstandingTotalCents(invoices)).toBe(3000);
  });
});

describe('revenueThisMonthCents', () => {
  it('counts only bookings starting in the current month', () => {
    const list = [
      booking({ startAt: '2026-06-02T16:00:00+10:00', totalCents: 10000 }),
      booking({ startAt: '2026-05-30T16:00:00+10:00', totalCents: 99999 }),
    ];
    expect(revenueThisMonthCents(list, now)).toBe(10000);
  });
});

describe('capacityUtilisation', () => {
  it('computes booked vs total nights and caps at 100%', () => {
    const list = [booking({ startAt: '2026-06-17T16:00:00+10:00', endAt: '2026-06-19T10:00:00+10:00' })]; // 2 nights
    const result = capacityUtilisation(list, now, 14, 2); // 28 total nights
    expect(result.totalNights).toBe(28);
    expect(result.bookedNights).toBe(2);
    expect(result.pct).toBe(7);
  });
});

describe('momChangePct', () => {
  it('returns signed month-over-month change', () => {
    const series: RevenuePoint[] = [
      { label: 'May', amountCents: 1000 },
      { label: 'Jun', amountCents: 1200 },
    ];
    expect(momChangePct(series)).toBe(20);
  });
});
