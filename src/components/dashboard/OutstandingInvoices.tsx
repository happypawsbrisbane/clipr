import { Card } from './Card';
import { Icon } from '@/components/ui/Icon';
import { formatAUD, formatDate, gstComponentCents } from '@/lib/format';
import { clientById } from '@/data/mock';
import type { Invoice } from '@/types';

export function OutstandingInvoices({
  invoices,
  asOf,
}: {
  invoices: Invoice[];
  asOf: Date;
}) {
  return (
    <Card
      title="Outstanding invoices"
      action={
        <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-300">
          All invoices <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </a>
      }
    >
      <ul className="divide-y divide-black/5 dark:divide-white/10">
        {invoices.map((inv) => {
          const overdue = inv.status === 'overdue' || new Date(inv.dueDate) < asOf;
          return (
            <li key={inv.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink dark:text-white">
                  {inv.number} <span className="font-normal text-ink/50 dark:text-white/50">· {clientById(inv.clientId)?.name}</span>
                </p>
                <p className="text-xs text-ink/55 dark:text-white/55">
                  Due {formatDate(inv.dueDate)} · incl. {formatAUD(gstComponentCents(inv.totalCents))} GST
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold text-ink dark:text-white">{formatAUD(inv.totalCents)}</span>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-[11px] font-medium',
                    overdue
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
                  ].join(' ')}
                >
                  {overdue ? 'Overdue' : 'Sent'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
