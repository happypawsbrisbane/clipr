import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Dashboard } from '@/pages/Dashboard';
import { Clients } from '@/pages/Clients';
import { ClientDetail } from '@/pages/ClientDetail';
import { useTheme } from '@/lib/useTheme';
import { useStore } from '@/lib/store';
import { useHashRoute, segments } from '@/lib/useHashRoute';
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
  const store = useStore();
  const { path, navigate } = useHashRoute();
  const parts = segments(path);

  let content: JSX.Element;
  let heading = 'Good morning, Sahara';

  if (parts[0] === 'clients' && parts[1]) {
    content = (
      <ClientDetail
        state={store.state}
        clientId={parts[1]}
        onAddPet={store.addPet}
        onDeletePet={store.deletePet}
        onDeleteClient={store.deleteClient}
        onBack={() => navigate('/clients')}
      />
    );
    heading = 'Client details';
  } else if (parts[0] === 'clients') {
    content = (
      <Clients
        state={store.state}
        onAddClient={store.addClient}
        onOpenClient={(id) => navigate(`/clients/${id}`)}
      />
    );
    heading = 'Clients';
  } else {
    content = <Dashboard />;
  }

  return (
    <div className="flex min-h-screen bg-sand text-ink dark:bg-brand-900/40 dark:text-white">
      <Sidebar current={parts[0] ?? 'dashboard'} onNavigate={navigate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar theme={theme} onToggleTheme={toggle} heading={heading} dateLabel={dateFormatter.format(now)} />
        {content}
      </div>
    </div>
  );
}
