// Australian-locale formatting helpers. All money is stored as integer cents
// (AUD) and only converted for display here.

const GST_RATE = 0.1;

const currency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const currencyWithCents = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export function formatAUD(cents: number, withCents = false): string {
  const dollars = cents / 100;
  return withCents ? currencyWithCents.format(dollars) : currency.format(dollars);
}

/** GST component of a GST-inclusive total (cents). */
export function gstComponentCents(inclusiveCents: number): number {
  return Math.round(inclusiveCents - inclusiveCents / (1 + GST_RATE));
}

// All dates are rendered in the eastern business timezone (AEST/AEDT) so the
// dashboard reads consistently regardless of the viewer's device timezone.
const TZ = 'Australia/Sydney';

const dayMonth = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', timeZone: TZ });
const numericDate = new Intl.DateTimeFormat('en-AU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: TZ,
});
const weekdayTime = new Intl.DateTimeFormat('en-AU', {
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TZ,
});

export function formatDayMonth(iso: string): string {
  return dayMonth.format(new Date(iso));
}

/** DD/MM/YYYY, the standard Australian numeric date format. */
export function formatDate(iso: string): string {
  return numericDate.format(new Date(iso));
}

export function formatWeekdayTime(iso: string): string {
  return weekdayTime.format(new Date(iso));
}

/** Human "time ago" for activity feeds, relative to now. */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const seconds = Math.round((now.getTime() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
