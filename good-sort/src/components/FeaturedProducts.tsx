"use client";

import { useEffect, useRef } from "react";
import { FEATURED_IDS, KIND_LABELS, PRODUCTS, PRODUCT_BY_ID, filterProducts, type Kind } from "@/lib/catalogue";
import { useUI } from "@/lib/ui";
import { ArrowRightIcon } from "./Icons";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

const FILTERS: (Kind | "all")[] = ["all", "dogs", "humans", "walk", "apparel", "accessories"];

export function FeaturedProducts() {
  const { filter, setFilter } = useUI();
  const scroller = useRef<HTMLDivElement>(null);

  const featured = FEATURED_IDS.map((id) => PRODUCT_BY_ID[id]);
  const products = filter === "all" ? featured : filterProducts(PRODUCTS, filter);

  useEffect(() => {
    scroller.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [filter]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 24), behavior: "smooth" });
  };

  return (
    <section id="shop" className="scroll-mt-16 py-16 md:py-24" aria-labelledby="shop-title">
      <Reveal className="px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="shop-title" className="display text-[12vw] md:text-[5.5vw]">
            {filter === "all" ? "The collection" : KIND_LABELS[filter]}
          </h2>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-chalk"
              aria-label="Scroll products left"
            >
              <ArrowRightIcon size={18} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-chalk"
              aria-label="Scroll products right"
            >
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto py-1" role="group" aria-label="Filter the collection">
          {FILTERS.map((k) => {
            const active = k === filter;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 ${
                  active ? "border-ink bg-ink text-chalk" : "border-ink/20 hover:border-ink"
                }`}
              >
                {k === "all" ? "Everything" : KIND_LABELS[k]}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div
        ref={scroller}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:gap-6 md:px-8"
        aria-live="polite"
      >
        {products.map((p) => (
          <div key={p.id} data-card className="w-[72vw] shrink-0 snap-start sm:w-[46vw] md:w-[320px]">
            <ProductCard product={p} />
          </div>
        ))}
        <div className="w-px shrink-0" aria-hidden="true" />
      </div>
      <p className="label mt-2 px-5 text-ink/40 md:px-8">
        {products.length} {products.length === 1 ? "piece" : "pieces"} · Prices in AUD, GST included
      </p>
    </section>
  );
}
