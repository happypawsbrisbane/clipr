import type { ReactNode } from 'react';

/** Shared surface for dashboard panels. */
export function Card({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-black/5 bg-white p-5 shadow-card dark:border-white/10 dark:bg-brand-900 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-sm font-semibold text-ink dark:text-white">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
