import { describe, expect, it } from 'vitest';
import { formatAUD, formatDate, gstComponentCents, timeAgo } from './format';

describe('formatAUD', () => {
  it('formats whole dollars in AUD', () => {
    expect(formatAUD(124000)).toBe('$1,240');
  });

  it('shows cents when requested', () => {
    expect(formatAUD(112050, true)).toBe('$1,120.50');
  });
});

describe('gstComponentCents', () => {
  it('extracts the 10% GST from a GST-inclusive total', () => {
    // $110 inclusive => $10 GST
    expect(gstComponentCents(11000)).toBe(1000);
  });
});

describe('formatDate', () => {
  it('renders DD/MM/YYYY', () => {
    expect(formatDate('2026-06-17T09:00:00+10:00')).toBe('17/06/2026');
  });
});

describe('timeAgo', () => {
  it('reports minutes for recent events', () => {
    const now = new Date('2026-06-17T09:00:00+10:00');
    expect(timeAgo('2026-06-17T08:30:00+10:00', now)).toBe('30m ago');
  });
});
