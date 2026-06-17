// Minimal inline icon set so the dashboard has no external icon dependency.
// Stroke-based, 24x24, inherits currentColor.
// TODO(future): swap for lucide-react if the icon surface grows.

type IconName =
  | 'dashboard'
  | 'calendar'
  | 'paw'
  | 'users'
  | 'invoice'
  | 'message'
  | 'settings'
  | 'bell'
  | 'search'
  | 'camera'
  | 'check'
  | 'journal'
  | 'dollar'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  | 'sun'
  | 'moon';

const PATHS: Record<IconName, JSX.Element> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </>
  ),
  paw: (
    <>
      <circle cx="6" cy="11" r="1.6" />
      <circle cx="10" cy="7.5" r="1.6" />
      <circle cx="14" cy="7.5" r="1.6" />
      <circle cx="18" cy="11" r="1.6" />
      <path d="M8.5 15.5c1-2 2.2-3 3.5-3s2.5 1 3.5 3c1 2 .2 3.7-1.7 3.7-1 0-1.3-.4-1.8-.4s-.8.4-1.8.4c-1.9 0-2.7-1.7-1.7-3.7Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17 19a5 5 0 0 0-3-4.6" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3h9l3 3v15l-2-1-2 1-2-1-2 1-2-1-2 1V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  message: (
    <path d="M4 5h16v11H9l-4 3v-3H4V5Z" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  bell: (
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8h4l2-2h6l2 2h4v11H3V8Z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  check: <path d="M5 12l4 4L19 7" />,
  journal: (
    <>
      <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  dollar: <path d="M12 3v18M16 7a4 4 0 0 0-4-2c-2.2 0-4 1.3-4 3s1.8 2.5 4 3 4 1.3 4 3-1.8 3-4 3a4 4 0 0 1-4-2" />,
  'arrow-up': <path d="M12 19V5M6 11l6-6 6 6" />,
  'arrow-down': <path d="M12 5v14M6 13l6 6 6-6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </>
  ),
  moon: <path d="M21 12.8A8 8 0 1 1 11.2 3a6.2 6.2 0 0 0 9.8 9.8Z" />,
};

export function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
