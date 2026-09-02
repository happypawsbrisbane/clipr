"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { COLOURS, stillFor, type ColourKey, type Product } from "@/lib/catalogue";
import { formatAUD } from "@/lib/money";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/useDialog";
import { Frame } from "./Frame";
import { CheckIcon, CloseIcon } from "./Icons";
import { MagneticButton } from "./MagneticButton";
import { Swatches } from "./Swatches";

const EASE = [0.16, 1, 0.3, 1] as const;

function QuickViewBody({ product, initialColour }: { product: Product; initialColour?: ColourKey }) {
  const { add } = useCart();
  const { notify, openCart, closeQuickView, openInfo } = useUI();
  const [colour, setColour] = useState<ColourKey>(initialColour ?? product.colours[0]);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(t);
  }, [added]);

  const submit = () => {
    if (product.soldOut) return;
    if (!size) {
      setError("Choose a size first.");
      return;
    }
    add(product, colour, size);
    setAdded(true);
    setError(null);
    notify(`${product.name} added to your bag`);
    window.setTimeout(() => {
      closeQuickView();
      openCart();
    }, 700);
  };

  const still = stillFor(product, colour);

  return (
    <div className="grid md:grid-cols-2">
      <Frame
        tone={still ? product.images.tone : colour}
        src={still}
        alt={`${product.name} in ${COLOURS[colour].name}`}
        caption={`${product.name} · ${COLOURS[colour].name}`}
        className="aspect-[4/5] max-h-[38vh] md:max-h-none md:aspect-auto md:min-h-[560px]"
        mark="lg"
      />
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            {product.badge ? (
              <p className="label mb-3 text-oxblood">{product.badge === "new" ? "New" : "Sold out"}</p>
            ) : null}
            <h2 id="quick-view-title" className="display text-3xl md:text-4xl">
              {product.name}
            </h2>
            <p className="mt-2 text-[15px] text-ink/60">
              {formatAUD(product.priceCents)} <span className="label ml-1">AUD</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-ink/80">{product.blurb}</p>

        <div className="mt-8">
          <p className="label mb-3">
            Colour <span className="text-ink/50">· {COLOURS[colour].name}</span>
          </p>
          <Swatches colours={product.colours} value={colour} onChange={setColour} size="md" name={product.name} />
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="label" id="size-label">
              Size{size ? <span className="text-ink/50"> · {size}</span> : null}
            </p>
            {product.sizeNote ? (
              <button type="button" className="link label text-ink/60" onClick={() => openInfo("sizing")}>
                Sizing guide
              </button>
            ) : null}
          </div>
          <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const selected = s === size;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setSize(s);
                    setError(null);
                  }}
                  className={`min-h-11 min-w-12 rounded-full border px-4 text-[13px] transition-colors duration-300 ${
                    selected
                      ? "border-ink bg-ink text-chalk"
                      : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {product.sizeNote ? <p className="mt-3 text-[12px] text-ink/60">{product.sizeNote}</p> : null}
          {error ? (
            <p className="mt-3 text-[13px] text-oxblood" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-8">
          <MagneticButton className="w-full" onClick={submit} disabled={product.soldOut}>
            {product.soldOut ? (
              "Sold out"
            ) : added ? (
              <>
                <CheckIcon size={16} /> Added
              </>
            ) : (
              `Add to bag · ${formatAUD(product.priceCents)}`
            )}
          </MagneticButton>
          {product.soldOut ? (
            <p className="mt-3 text-[13px] text-ink/60">
              Back in the next drop.{" "}
              <a href="#join" className="link" onClick={closeQuickView}>
                Join the list
              </a>{" "}
              to hear first.
            </p>
          ) : null}
        </div>

        <ul className="mt-8 space-y-2 border-t border-ink/10 pt-6 text-[13px] text-ink/70">
          {product.details.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-ink/40" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function QuickView() {
  const { quickView, closeQuickView } = useUI();
  const open = quickView !== null;
  const ref = useDialog<HTMLDivElement>(open, closeQuickView);

  return (
    <AnimatePresence>
      {quickView ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.button
            type="button"
            aria-label="Close quick view"
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeQuickView}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            className="relative max-h-[92vh] w-full overflow-y-auto bg-chalk text-ink md:max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <button
              type="button"
              onClick={closeQuickView}
              className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-chalk/80 backdrop-blur hover:bg-chalk"
              aria-label="Close quick view"
              data-autofocus
            >
              <CloseIcon size={22} />
            </button>
            <QuickViewBody key={quickView.product.id} product={quickView.product} initialColour={quickView.colour} />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
