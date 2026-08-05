import { describe, expect, it } from 'vitest';
import { bookingCoversDay, bookingsOnDay, findConflicts, monthGrid, rangesOverlap } from './bookings';
import type { Booking } from '@/types';

const overnight = (over: Partial<Booking>): Booking => ({
  id: 'b', clientId: 'c', petIds: ['p'], service: 'overnight', status: 'confirmed',
  startAt: '2026-06-16T17:00:00+10:00', endAt: '2026-06-20T10:00:00+10:00', totalCents: 100000,
  ...over,
});

describe('monthGrid', () => {
  it('returns 42 cells starting on a Monday', () => {
    const grid = monthGrid(new Date(2026, 5, 15)); // June 2026
    expect(grid).toHaveLength(42);
    expect(grid[0].date.getDay()).toBe(1); // Monday
  });

  it('flags days outside the anchor month', () => {
    const grid = monthGrid(new Date(2026, 5, 15));
    expect(grid.some((d) => !d.inMonth)).toBe(true);
    expect(grid.filter((d) => d.inMonth)).toHaveLength(30); // June has 30 days
  });
});

describe('bookingCoversDay', () => {
  it('covers every day spanned by an overnight stay', () => {
    const b = overnight({});
    expect(bookingCoversDay(b, new Date('2026-06-17T00:00:00+10:00'))).toBe(true);
    expect(bookingCoversDay(b, new Date('2026-06-21T00:00:00+10:00'))).toBe(false);
  });
});

describe('bookingsOnDay', () => {
  it('excludes cancelled bookings and sorts by start', () => {
    const list = [
      overnight({ id: 'a', startAt: '2026-06-17T18:00:00+10:00', endAt: '2026-06-18T09:00:00+10:00' }),
      overnight({ id: 'cancelled', status: 'cancelled' }),
    ];
    const day = new Date('2026-06-17T00:00:00+10:00');
    expect(bookingsOnDay(list, day).map((b) => b.id)).toEqual(['a']);
  });
});

describe('rangesOverlap', () => {
  it('detects overlap and adjacency correctly', () => {
    expect(rangesOverlap('2026-06-01', '2026-06-05', '2026-06-04', '2026-06-09')).toBe(true);
    // touching at the boundary is not an overlap
    expect(rangesOverlap('2026-06-01', '2026-06-05', '2026-06-05', '2026-06-09')).toBe(false);
  });
});

describe('findConflicts', () => {
  const existing = [overnight({ id: 'existing' })];

  it('flags an overlapping overnight booking', () => {
    const candidate = { service: 'overnight' as const, startAt: '2026-06-19T17:00:00+10:00', endAt: '2026-06-22T10:00:00+10:00' };
    expect(findConflicts(existing, candidate).map((b) => b.id)).toEqual(['existing']);
  });

  it('ignores non-overnight services and the booking being edited', () => {
    const candidate = { service: 'drop_in' as const, startAt: '2026-06-17T12:00:00+10:00', endAt: '2026-06-17T13:00:00+10:00' };
    expect(findConflicts(existing, candidate)).toHaveLength(0);
    const editingSelf = { service: 'overnight' as const, startAt: '2026-06-16T17:00:00+10:00', endAt: '2026-06-20T10:00:00+10:00' };
    expect(findConflicts(existing, editingSelf, 'existing')).toHaveLength(0);
  });
});
