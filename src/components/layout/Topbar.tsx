import { Icon } from '@/components/ui/Icon';

export function Topbar({
  theme,
  onToggleTheme,
  dateLabel,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  dateLabel: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-sand/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-brand-900/80 sm:px-6">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-ink dark:text-white sm:text-xl">
          Good morning, Sahara
        </h1>
        <p className="truncate text-xs text-ink/60 dark:text-white/60">{dateLabel}</p>
      </div>

      <label className="relative hidden items-center sm:flex">
        <span className="sr-only">Search</span>
        <Icon name="search" className="pointer-events-none absolute left-3 h-4 w-4 text-ink/40 dark:text-white/40" />
        <input
          type="search"
          placeholder="Search clients, pets…"
          className="w-56 rounded-lg border border-black/10 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
        />
      </label>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-pressed={theme === 'dark'}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="grid h-10 w-10 place-items-center rounded-lg border border-black/10 bg-white text-ink/70 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Notifications (3 unread)"
        className="relative grid h-10 w-10 place-items-center rounded-lg border border-black/10 bg-white text-ink/70 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
      >
        <Icon name="bell" className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-brand-900" />
      </button>
    </header>
  );
}
