import { StatCard, type Stat } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { UpcomingBookings } from '@/components/dashboard/UpcomingBookings';
import { OutstandingInvoices } from '@/components/dashboard/OutstandingInvoices';
import { CapacityCard } from '@/components/dashboard/CapacityCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { formatAUD } from '@/lib/format';
import {
  capacityUtilisation,
  momChangePct,
  outstandingTotalCents,
  overdueInvoices,
  revenueThisMonthCents,
  upcomingBookings,
} from '@/lib/metrics';
import { activity, bookings, clients, invoices, now, revenueByMonth } from '@/data/mock';

// Boutique sitters run a handful of overnight slots; keep capacity small.
const NIGHTLY_CAPACITY = 2;
const HORIZON_DAYS = 14;

export function Dashboard() {
  const upcoming = upcomingBookings(bookings, now);
  const overdue = overdueInvoices(invoices, now);
  const capacity = capacityUtilisation(bookings, now, HORIZON_DAYS, NIGHTLY_CAPACITY);

  const stats: Stat[] = [
    {
      label: 'Revenue this month',
      value: formatAUD(revenueThisMonthCents(bookings, now)),
      icon: 'dollar',
      changePct: momChangePct(revenueByMonth),
      hint: 'GST-inclusive, booked',
    },
    {
      label: 'Upcoming bookings',
      value: String(upcoming.length),
      icon: 'calendar',
      hint: `Next ${HORIZON_DAYS} days`,
    },
    {
      label: 'Outstanding',
      value: formatAUD(outstandingTotalCents(invoices)),
      icon: 'invoice',
      hint: `${overdue.length} overdue`,
    },
    {
      label: 'Active clients',
      value: String(clients.length),
      icon: 'users',
      changePct: 8,
      hint: 'Concierge roster',
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueByMonth} />
        </div>
        <CapacityCard
          pct={capacity.pct}
          bookedNights={capacity.bookedNights}
          totalNights={capacity.totalNights}
          days={HORIZON_DAYS}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingBookings bookings={upcoming} />
        </div>
        <ActivityFeed items={activity} now={now} />
      </div>

      <div className="mt-4">
        <OutstandingInvoices invoices={overdue} asOf={now} />
      </div>
    </main>
  );
}
