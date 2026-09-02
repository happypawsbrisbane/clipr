"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

type Variant = "ink" | "chalk" | "oxblood" | "outline" | "outline-chalk";

const VARIANTS: Record<Variant, string> = {
  ink: "bg-ink text-chalk hover:bg-oxblood",
  chalk: "bg-chalk text-ink hover:bg-citron",
  oxblood: "bg-oxblood text-chalk hover:bg-ink",
  outline: "border border-ink text-ink hover:bg-ink hover:text-chalk",
  "outline-chalk": "border border-chalk text-chalk hover:bg-chalk hover:text-ink",
};

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

/** A pill button that leans gently toward the cursor. Falls back to a plain button with reduced motion. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "ink",
  className = "",
  type = "button",
  disabled,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[13px] font-medium tracking-[0.02em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        <a href={href} onClick={onClick} className={classes} aria-label={ariaLabel}>
          {children}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={classes} disabled={disabled} aria-label={ariaLabel}>
          {children}
        </button>
      )}
    </motion.div>
  );
}
