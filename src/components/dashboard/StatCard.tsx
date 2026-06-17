import { Icon, type IconName } from '@/components/ui/Icon';

export interface Stat {
  label: string;
  value: string;
  icon: IconName;
  /** Optional signed percentage change vs prior period. */
  changePct?: number | null;
  hint?: string;
}

export function StatCard({ label, value, icon, changePct, hint }: Stat) {
  const hasChange = typeof changePct === 'number';
  const up = hasChange && changePct! >= 0;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card dark:border-white/10 dark:bg-brand-900">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {hasChange && (
          <span
            className={[
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              up
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
            ].join(' ')}
          >
            <Icon name={up ? 'arrow-up' : 'arrow-down'} className="h-3.5 w-3.5" />
            {Math.abs(changePct!)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-ink dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{label}</p>
      {hint && <p className="mt-2 text-xs text-ink/45 dark:text-white/45">{hint}</p>}
    </div>
  );
}
