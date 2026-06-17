import { Icon, type IconName } from '@/components/ui/Icon';

interface NavItem {
  label: string;
  icon: IconName;
  active?: boolean;
  badge?: number;
}

// Mirrors the MVP feature areas in the spec. Only Dashboard is wired up in v1.
const NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', active: true },
  { label: 'Bookings', icon: 'calendar' },
  { label: 'Clients & pets', icon: 'paw' },
  { label: 'Invoices', icon: 'invoice', badge: 2 },
  { label: 'Messages', icon: 'message', badge: 3 },
  { label: 'Clients', icon: 'users' },
  { label: 'Settings', icon: 'settings' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-6 dark:border-white/10 dark:bg-brand-900 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
          <Icon name="paw" className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink dark:text-white">PetSitter Pro</p>
          <p className="text-xs text-brand-600 dark:text-brand-300">Concierge edition</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Primary">
        {NAV.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? 'page' : undefined}
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
              item.active
                ? 'bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-white'
                : 'text-ink/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5',
            ].join(' ')}
          >
            <Icon name={item.icon} className="h-5 w-5 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                {item.badge}
              </span>
            ) : null}
          </a>
        ))}
      </nav>

      <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm dark:bg-white/5">
        <p className="font-semibold text-brand-800 dark:text-white">Sahara R.</p>
        <p className="text-xs text-ink/60 dark:text-white/60">Boutique sitter · Sydney</p>
      </div>
    </aside>
  );
}
