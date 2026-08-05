// Pure helpers for the bookings calendar. React-free and unit-tested.

import type { Booking } from '@/types';

export interface CalendarDay {
  /** Midnight (local) for this cell. */
  date: Date;
  /** Whether the day falls in the displayed month. */
  inMonth: boolean;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * Builds a 6-week (42-cell) grid for the month containing `monthAnchor`,
 * starting on Monday — the conventional Australian week start.
 */
export function monthGrid(monthAnchor: Date): CalendarDay[] {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();
  const first = new Date(year, month, 1);
  // Monday = 0 … Sunday = 6
  const offset = (first.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { date, inMonth: date.getMonth() === month };
  });
}

/** True if the booking's date range covers the given calendar day. */
export function bookingCoversDay(booking: Booking, day: Date): boolean {
  const dayStart = startOfDay(day).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;
  const start = new Date(booking.startAt).getTime();
  const end = new Date(booking.endAt).getTime();
  return start < dayEnd && end > dayStart;
}

export function bookingsOnDay(bookings: Booking[], day: Date): Booking[] {
  return bookings
    .filter((b) => b.status !== 'cancelled' && bookingCoversDay(b, day))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

/** Two time ranges overlap if each starts before the other ends. */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

/**
 * Overnight bookings can't overlap — a single sitter can only host one
 * overnight stay at a time. Returns the existing overnight bookings that
 * clash with the candidate (ignoring `ignoreId` when editing).
 */
export function findConflicts(
  bookings: Booking[],
  candidate: { startAt: string; endAt: string; service: Booking['service'] },
  ignoreId?: string,
): Booking[] {
  if (candidate.service !== 'overnight') return [];
  return bookings.filter(
    (b) =>
      b.id !== ignoreId &&
      b.service === 'overnight' &&
      b.status !== 'cancelled' &&
      rangesOverlap(candidate.startAt, candidate.endAt, b.startAt, b.endAt),
  );
}
