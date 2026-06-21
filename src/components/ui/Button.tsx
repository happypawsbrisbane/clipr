import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500/40',
  secondary:
    'border border-black/10 bg-white text-ink hover:bg-black/5 focus:ring-brand-500/30 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500/40',
  ghost: 'text-ink/70 hover:bg-black/5 focus:ring-brand-500/30 dark:text-white/70 dark:hover:bg-white/10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
