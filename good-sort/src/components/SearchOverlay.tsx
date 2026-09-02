"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { COLOURS, PRODUCTS, stillFor, searchProducts } from "@/lib/catalogue";
import { formatAUD } from "@/lib/money";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/useDialog";
import { Frame } from "./Frame";
import { ArrowUpRightIcon, CloseIcon, SearchIcon } from "./Icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const SUGGESTIONS = ["Harness", "Lead", "Tee", "Oxblood", "Walk gear"];

export function SearchOverlay() {
  const { searchOpen, closeSearch, openQuickView } = useUI();
  const [query, setQuery] = useState("");
  const ref = useDialog<HTMLDivElement>(searchOpen, closeSearch);
  const results = query.trim() ? searchProducts(query) : PRODUCTS.slice(0, 4);
  const searching = query.trim().length > 0;

  return (
    <AnimatePresence onExitComplete={() => setQuery("")}>
      {searchOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close search"
            className="fixed inset-0 z-50 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeSearch}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-50 max-h-[92vh] overflow-y-auto bg-chalk text-ink"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (results[0]) openQuickView({ product: results[0] });
                }}
                className="flex items-center gap-4 border-b border-ink pb-4 transition-colors focus-within:border-oxblood"
              >
                <SearchIcon size={24} />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="site-search"
                  data-autofocus
                  type="search"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search harnesses, leads, tees"
                  className="display w-full bg-transparent text-3xl placeholder:text-ink/30 focus-visible:outline-none md:text-5xl"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-ink/5"
                  aria-label="Close search"
                >
                  <CloseIcon size={22} />
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Suggestions">
                <span className="label mr-2 text-ink/50">Try</span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-ink/20 px-3 py-1.5 text-[13px] hover:border-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="label mt-8 text-ink/50" aria-live="polite">
                {searching
                  ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query.trim()}”`
                  : "Popular"}
              </p>

              {results.length === 0 ? (
                <p className="mt-4 text-[15px] text-ink/70">
                  Nothing by that name. Try a product type, a colour, or “walk gear”.
                </p>
              ) : (
                <ul className="mt-4 grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => openQuickView({ product: p })}
                        className="group w-full text-left"
                      >
                        <Frame
                          tone={p.images.tone}
                          src={stillFor(p, p.images.base)}
                          alt={`${p.name} in ${COLOURS[p.colours[0]].name}`}
                          className="aspect-[4/5] w-full"
                          mark="lg"
                        />
                        <span className="mt-3 flex items-start justify-between gap-2">
                          <span>
                            <span className="block text-[14px] font-medium">{p.name}</span>
                            <span className="mt-0.5 block text-[13px] text-ink/60">{formatAUD(p.priceCents)}</span>
                          </span>
                          <ArrowUpRightIcon
                            size={18}
                            className="mt-0.5 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
