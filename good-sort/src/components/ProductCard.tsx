"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { COLOURS, type ColourKey, type Product } from "@/lib/catalogue";
import { formatAUD } from "@/lib/money";
import { useUI } from "@/lib/ui";
import { Frame } from "./Frame";
import { CheckIcon } from "./Icons";
import { Swatches } from "./Swatches";

export function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const [colour, setColour] = useState<ColourKey>(product.colours[0]);
  const [added, setAdded] = useState(false);
  const { openQuickView, notify } = useUI();
  const { add } = useCart();

  const quickAdd = () => {
    if (product.soldOut) return;
    if (product.sizes.length === 1) {
      add(product, colour, product.sizes[0]);
      setAdded(true);
      notify(`${product.name} added to your bag`);
      window.setTimeout(() => setAdded(false), 1400);
    } else {
      openQuickView({ product, colour });
    }
  };

  const { still, worn } = product.images;
  const badgeLabel = product.badge === "new" ? "New" : product.badge === "sold-out" ? "Sold out" : null;

  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className="relative">
        <button
          type="button"
          onClick={() => openQuickView({ product, colour })}
          className="relative block aspect-[4/5] w-full overflow-hidden text-left"
          aria-label={`Quick view ${product.name}`}
        >
          <Frame
            tone={still.src ? still.tone : colour}
            src={still.src}
            sizes="(min-width: 768px) 320px, 72vw"
            alt={`${product.name} in ${COLOURS[colour].name}`}
            caption={`${product.name} · ${COLOURS[colour].name}`}
            fill
            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            mark="lg"
          />
          <Frame
            tone={worn.tone}
            src={worn.src}
            sizes="(min-width: 768px) 320px, 72vw"
            alt={`${product.name} worn`}
            caption={`${product.name} · Worn`}
            fill
            className="opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
            mark="sm"
          />
        </button>
        {badgeLabel ? (
          <span
            className={`label pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1.5 ${
              product.soldOut ? "bg-chalk text-ink" : "bg-citron text-ink"
            }`}
          >
            {badgeLabel}
          </span>
        ) : null}
        <div className="absolute inset-x-3 bottom-3 md:translate-y-2 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={quickAdd}
            disabled={product.soldOut}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-chalk/95 text-[13px] font-medium text-ink backdrop-blur transition-colors duration-300 hover:bg-ink hover:text-chalk disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-chalk/95 disabled:hover:text-ink"
            aria-label={
              product.soldOut
                ? `${product.name} is sold out`
                : product.sizes.length === 1
                  ? `Add ${product.name} in ${COLOURS[colour].name} to bag`
                  : `Choose a size for ${product.name}`
            }
          >
            {product.soldOut ? (
              "Sold out"
            ) : added ? (
              <>
                <CheckIcon size={16} /> Added
              </>
            ) : product.sizes.length === 1 ? (
              "Quick add"
            ) : (
              "Quick add · Select size"
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-medium leading-tight">{product.name}</h3>
          <p className="mt-1 text-[13px] text-ink/60 tabular-nums">{formatAUD(product.priceCents)}</p>
        </div>
        <div className="pt-1">
          <Swatches colours={product.colours} value={colour} onChange={setColour} name={product.name} />
        </div>
      </div>
    </article>
  );
}
