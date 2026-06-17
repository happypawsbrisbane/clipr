import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Dashboard } from '@/pages/Dashboard';
import { useTheme } from '@/lib/useTheme';
import { now } from '@/data/mock';

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Australia/Sydney',
});

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-sand text-ink dark:bg-brand-900/40 dark:text-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar theme={theme} onToggleTheme={toggle} dateLabel={dateFormatter.format(now)} />
        <Dashboard />
      </div>
    </div>
  );
}
