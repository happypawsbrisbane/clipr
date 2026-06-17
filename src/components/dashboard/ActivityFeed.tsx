import { Card } from './Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { timeAgo } from '@/lib/format';
import type { ActivityItem, ActivityKind } from '@/types';

const KIND_ICON: Record<ActivityKind, IconName> = {
  check_in: 'check',
  photo: 'camera',
  journal: 'journal',
  payment: 'dollar',
  request: 'bell',
};

export function ActivityFeed({ items, now }: { items: ActivityItem[]; now: Date }) {
  return (
    <Card title="Recent activity">
      <ol className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">
              <Icon name={KIND_ICON[item.kind]} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-ink dark:text-white/90">{item.message}</p>
              <p className="text-xs text-ink/45 dark:text-white/45">{timeAgo(item.at, now)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
