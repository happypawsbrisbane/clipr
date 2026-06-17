import { Card } from './Card';
import { formatAUD } from '@/lib/format';
import type { RevenuePoint } from '@/types';

/**
 * Dependency-free SVG bar chart. Accessible: the data is also exposed as a
 * visually-hidden table for screen readers.
 */
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const max = Math.max(...data.map((d) => d.amountCents), 1);

  return (
    <Card title="Revenue" action={<span className="text-xs text-ink/50 dark:text-white/50">Last 6 months</span>}>
      <div className="flex h-44 items-end gap-3" role="img" aria-label="Monthly revenue, last six months">
        {data.map((d) => {
          const heightPct = Math.round((d.amountCents / max) * 100);
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="group relative w-full rounded-t-md bg-brand-500/80 transition hover:bg-brand-600 dark:bg-brand-400/70 dark:hover:bg-brand-300"
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                >
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100 dark:bg-white dark:text-ink">
                    {formatAUD(d.amountCents)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-ink/55 dark:text-white/55">{d.label}</span>
            </div>
          );
        })}
      </div>

      <table className="sr-only">
        <caption>Monthly revenue</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{formatAUD(d.amountCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
