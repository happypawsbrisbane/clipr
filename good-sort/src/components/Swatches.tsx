"use client";

import { COLOURS, type ColourKey } from "@/lib/catalogue";

type Props = {
  colours: ColourKey[];
  value: ColourKey;
  onChange: (c: ColourKey) => void;
  size?: "sm" | "md";
  name: string;
  onDark?: boolean;
};

export function Swatches({ colours, value, onChange, size = "sm", name, onDark }: Props) {
  const dim = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const ring = onDark ? "ring-chalk" : "ring-ink";
  return (
    <div role="radiogroup" aria-label={`${name} colour`} className="flex items-center gap-2">
      {colours.map((c) => {
        const selected = c === value;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={COLOURS[c].name}
            title={COLOURS[c].name}
            onClick={(e) => {
              e.stopPropagation();
              onChange(c);
            }}
            className={`${dim} rounded-full ring-1 ring-offset-2 transition-transform duration-300 ${
              onDark ? "ring-offset-ink" : "ring-offset-chalk"
            } ${selected ? `${ring} scale-110` : "ring-ink/15 hover:scale-110"}`}
            style={{ backgroundColor: COLOURS[c].hex }}
          />
        );
      })}
    </div>
  );
}
