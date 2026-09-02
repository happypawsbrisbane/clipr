"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { COLOURS, PRODUCT_BY_ID, WALK_SET_IDS, type ColourKey } from "@/lib/catalogue";
import { formatAUD } from "@/lib/money";
import { useUI } from "@/lib/ui";
import { Frame } from "./Frame";
import { CheckIcon } from "./Icons";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { Swatches } from "./Swatches";

type Choice = { colour: ColourKey; size: string; included: boolean };

/** Where each piece sits on the composition, as a percentage of the frame. */
const HOTSPOTS: Record<string, { x: number; y: number }> = {
  "everyday-harness": { x: 58, y: 62 },
  "kindred-rope-lead": { x: 44, y: 40 },
  "kindred-bandana": { x: 66, y: 50 },
  "walkabout-crossbody": { x: 28, y: 46 },
};

export function ShopTheWalk() {
  const { add } = useCart();
  const { notify, openCart, openInfo } = useUI();
  const items = WALK_SET_IDS.map((id) => PRODUCT_BY_ID[id]);

  const [choices, setChoices] = useState<Record<string, Choice>>(() =>
    Object.fromEntries(
      items.map((p) => [p.id, { colour: p.colours[0], size: p.sizes[0], included: true }]),
    ),
  );
  const [active, setActive] = useState(items[0].id);
  const [added, setAdded] = useState(false);

  const update = (id: string, patch: Partial<Choice>) =>
    setChoices((c) => ({ ...c, [id]: { ...c[id], ...patch } }));

  const included = items.filter((p) => choices[p.id].included);
  const total = useMemo(() => included.reduce((n, p) => n + p.priceCents, 0), [included]);

  const addSet = () => {
    if (included.length === 0) return;
    included.forEach((p) => add(p, choices[p.id].colour, choices[p.id].size));
    setAdded(true);
    notify(`${included.length} ${included.length === 1 ? "piece" : "pieces"} added to your bag`);
    window.setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  const activeProduct = PRODUCT_BY_ID[active];

  return (
    <section id="the-walk" className="scroll-mt-16 px-5 py-20 md:px-8 md:py-28" aria-labelledby="walk-title">
      <Reveal className="mb-10 md:mb-14">
        <p className="label text-ink/50">Shop the walk</p>
        <h2 id="walk-title" className="display mt-3 text-[12vw] md:text-[5.5vw]">
          The whole set, one add.
        </h2>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-7">
          <div className="relative aspect-[4/5] md:aspect-[5/6]">
            <Frame
              tone={choices[active].colour === "chalk" || choices[active].colour === "powder" ? "denim" : "powder"}
              alt="Composition photograph: the Everyday Harness, Kindred Rope Lead, Kindred Bandana and Walkabout Crossbody laid out together"
              caption="Composition 01 · The Walk · Photography to follow"
              fill
              mark="lg"
            />
            {items.map((p, i) => {
              const spot = HOTSPOTS[p.id];
              const isActive = p.id === active;
              const on = choices[p.id].included;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p.id)}
                  aria-label={`${p.name}${on ? "" : ", not included"}`}
                  aria-pressed={isActive}
                  className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[12px] font-semibold tabular-nums transition-all duration-500 ${
                    isActive ? "scale-110 bg-ink text-chalk" : "bg-chalk text-ink hover:scale-110"
                  } ${on ? "" : "opacity-40"}`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {i + 1}
                </button>
              );
            })}
            <div className="absolute inset-x-5 bottom-5 hidden md:block">
              <p className="label text-ink/60">Selected</p>
              <p className="display mt-1 text-2xl">
                {activeProduct.name}{" "}
                <span className="text-ink/50">· {COLOURS[choices[active].colour].name}</span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.1}>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((p, i) => {
              const c = choices[p.id];
              const isActive = p.id === active;
              return (
                <li
                  key={p.id}
                  className={`py-5 transition-colors duration-500 ${isActive ? "" : "opacity-80"}`}
                  onFocus={() => setActive(p.id)}
                  onMouseEnter={() => setActive(p.id)}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-500 ${
                        isActive ? "bg-ink text-chalk" : "border border-ink/20"
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[15px] font-medium leading-tight">{p.name}</h3>
                          <p className="mt-1 text-[13px] text-ink/60 tabular-nums">{formatAUD(p.priceCents)}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={c.included}
                          aria-label={`Include ${p.name} in the set`}
                          onClick={() => update(p.id, { included: !c.included })}
                          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                            c.included ? "border-ink bg-ink text-chalk" : "border-ink/25 text-transparent hover:border-ink"
                          }`}
                        >
                          <CheckIcon size={14} />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Swatches
                          colours={p.colours}
                          value={c.colour}
                          onChange={(colour) => update(p.id, { colour })}
                          name={p.name}
                        />
                        {p.sizes.length > 1 ? (
                          <label className="flex items-center gap-2 text-[13px]">
                            <span className="label text-ink/50">Size</span>
                            <select
                              value={c.size}
                              onChange={(e) => update(p.id, { size: e.target.value })}
                              className="min-h-9 rounded-full border border-ink/20 bg-transparent px-3 pr-7 text-[13px] hover:border-ink"
                            >
                              {p.sizes.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-baseline justify-between">
            <p className="label">
              {included.length} of {items.length} pieces
            </p>
            <p className="display text-3xl tabular-nums">{formatAUD(total)}</p>
          </div>
          <div className="mt-5">
            <MagneticButton className="w-full" onClick={addSet} disabled={included.length === 0}>
              {added ? (
                <>
                  <CheckIcon size={16} /> Added to bag
                </>
              ) : included.length === items.length ? (
                "Add the complete set"
              ) : (
                `Add ${included.length} ${included.length === 1 ? "piece" : "pieces"}`
              )}
            </MagneticButton>
          </div>
          <p className="mt-4 text-[12px] text-ink/60">
            Not sure on harness size?{" "}
            <button type="button" className="link" onClick={() => openInfo("sizing")}>
              Measure their chest
            </button>{" "}
            first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
