"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { COLOURS, FREE_SHIPPING_THRESHOLD_CENTS, PRODUCT_BY_ID } from "@/lib/catalogue";
import { formatAUD } from "@/lib/money";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/useDialog";
import { Frame } from "./Frame";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons";
import { MagneticButton } from "./MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const { cartOpen, closeCart, notify, openInfo } = useUI();
  const { lines, count, subtotalCents, setQty, remove } = useCart();
  const ref = useDialog<HTMLElement>(cartOpen, closeCart);

  const remaining = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;
  const progress = Math.min(1, subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            className="fixed inset-0 z-50 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
          />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-chalk text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 id="cart-title" className="display text-2xl">
                Your bag <span className="text-ink/40">({count})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5"
                aria-label="Close bag"
                data-autofocus
              >
                <CloseIcon size={22} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="display text-3xl">Nothing in here yet.</p>
                <p className="mt-3 max-w-xs text-[15px] text-ink/60">
                  Start with the Everyday Harness, or a lead you'll want to hold.
                </p>
                <div className="mt-8">
                  <MagneticButton href="#shop" onClick={closeCart}>
                    Shop the collection
                  </MagneticButton>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-ink/10 px-6 py-4">
                  <p className="text-[13px]">
                    {remaining > 0 ? (
                      <>
                        You&rsquo;re <strong>{formatAUD(remaining)}</strong> from free Australian shipping.
                      </>
                    ) : (
                      <>Free Australian shipping unlocked.</>
                    )}
                  </p>
                  <div className="mt-3 h-px w-full bg-ink/10" aria-hidden="true">
                    <motion.div
                      className="h-px bg-oxblood"
                      initial={false}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </div>
                </div>

                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => {
                      const product = PRODUCT_BY_ID[line.productId];
                      return (
                        <motion.li
                          key={line.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 24 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="flex gap-4 border-b border-ink/10 py-5"
                        >
                          <Frame
                            tone={line.colour}
                            alt={`${product.name} in ${COLOURS[line.colour].name}`}
                            className="aspect-[4/5] w-20 shrink-0"
                            mark="lg"
                          />
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[15px] font-medium leading-tight">{product.name}</p>
                                <p className="mt-1 text-[13px] text-ink/60">
                                  {COLOURS[line.colour].name}
                                  {line.size !== "One size" ? ` · ${line.size}` : ""}
                                </p>
                              </div>
                              <p className="text-[15px] tabular-nums">
                                {formatAUD(product.priceCents * line.qty)}
                              </p>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="inline-flex items-center rounded-full border border-ink/15">
                                <button
                                  type="button"
                                  onClick={() => setQty(line.id, line.qty - 1)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
                                  aria-label={`Decrease quantity of ${product.name}`}
                                >
                                  <MinusIcon size={14} />
                                </button>
                                <span className="w-6 text-center text-[13px] tabular-nums" aria-live="polite">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQty(line.id, line.qty + 1)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
                                  aria-label={`Increase quantity of ${product.name}`}
                                >
                                  <PlusIcon size={14} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(line.id)}
                                className="link label text-ink/60 hover:text-ink"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-ink/10 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <p className="label">Subtotal</p>
                    <p className="display text-2xl tabular-nums">{formatAUD(subtotalCents)}</p>
                  </div>
                  <p className="mt-2 text-[12px] text-ink/60">
                    GST included.{" "}
                    <button type="button" className="link" onClick={() => openInfo("shipping")}>
                      Shipping
                    </button>{" "}
                    calculated at checkout.
                  </p>
                  <div className="mt-5">
                    <MagneticButton
                      className="w-full"
                      onClick={() => notify("Checkout connects to payments at launch. Your bag is saved.")}
                    >
                      Checkout · {formatAUD(subtotalCents)}
                    </MagneticButton>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
