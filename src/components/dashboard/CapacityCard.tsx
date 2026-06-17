import { Card } from './Card';

/** Radial-style capacity gauge using a single SVG ring. */
export function CapacityCard({
  pct,
  bookedNights,
  totalNights,
  days,
}: {
  pct: number;
  bookedNights: number;
  totalNights: number;
  days: number;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Card title="Capacity utilisation">
      <div className="flex flex-col items-center">
        <div className="relative grid place-items-center">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="14" className="stroke-black/5 dark:stroke-white/10" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="stroke-brand-500 transition-[stroke-dashoffset] duration-700 dark:stroke-brand-300"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-2xl font-semibold text-ink dark:text-white">{pct}%</p>
            <p className="text-xs text-ink/55 dark:text-white/55">booked</p>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-ink/60 dark:text-white/60">
          {bookedNights} of {totalNights} overnight slots filled over the next {days} days
        </p>
      </div>
    </Card>
  );
}
