import type { ReactNode } from 'react';

const baseInput =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40';

function borderClass(hasError: boolean): string {
  return hasError
    ? 'border-rose-400 focus:border-rose-500'
    : 'border-black/10 focus:border-brand-500 dark:border-white/10';
}

interface FieldShellProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldShell({ label, htmlFor, error, hint, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink dark:text-white/90">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink/45 dark:text-white/45">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function TextField({ id, label, value, onChange, type = 'text', placeholder, error, hint, required }: TextFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint}>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInput} ${borderClass(Boolean(error))}`}
      />
    </FieldShell>
  );
}
