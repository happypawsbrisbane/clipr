"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/useDialog";
import { NAV } from "./Header";
import { CloseIcon } from "./Icons";
import { Wordmark } from "./Wordmark";

const EASE = [0.76, 0, 0.24, 1] as const;

export function MobileMenu() {
  const { menuOpen, closeMenu, setFilter, openInfo } = useUI();
  const ref = useDialog<HTMLDivElement>(menuOpen, closeMenu);

  return (
    <AnimatePresence>
      {menuOpen ? (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-dark fixed inset-0 z-50 flex flex-col bg-oxblood text-chalk"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex h-16 items-center justify-between px-3">
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-chalk/10"
              aria-label="Close menu"
              data-autofocus
            >
              <CloseIcon size={22} />
            </button>
            <Wordmark className="text-[22px]" />
            <span className="w-11" aria-hidden="true" />
          </div>

          <nav aria-label="Menu" className="flex flex-1 flex-col justify-center px-6">
            <ul className="space-y-1">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => {
                      if (item.filter) setFilter(item.filter);
                      closeMenu();
                    }}
                    className="display block py-2 text-[13vw] leading-none"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="flex items-end justify-between px-6 pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <ul className="label space-y-3">
              <li>
                <button type="button" className="link" onClick={() => openInfo("shipping")}>
                  Shipping
                </button>
              </li>
              <li>
                <button type="button" className="link" onClick={() => openInfo("sizing")}>
                  Sizing
                </button>
              </li>
              <li>
                <button type="button" className="link" onClick={() => openInfo("contact")}>
                  Contact
                </button>
              </li>
            </ul>
            <p className="label text-right text-chalk/70">
              Made for your kind.
              <br />
              Est. 2024
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
