"use client";

import { AnimatePresence, motion } from "framer-motion";
import { INFO } from "@/lib/info";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/useDialog";
import { CloseIcon } from "./Icons";

const EASE = [0.16, 1, 0.3, 1] as const;

export function InfoPanel() {
  const { info, closeInfo } = useUI();
  const ref = useDialog<HTMLElement>(info !== null, closeInfo);
  const content = info ? INFO[info] : null;

  return (
    <AnimatePresence>
      {content ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-50 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeInfo}
          />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-chalk text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 id="info-title" className="display text-2xl">
                {content.title}
              </h2>
              <button
                type="button"
                onClick={closeInfo}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5"
                aria-label="Close"
                data-autofocus
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-[17px] leading-snug">{content.intro}</p>
              {content.sections.map((s) => (
                <section key={s.heading} className="mt-8">
                  <h3 className="label mb-3 text-ink/60">{s.heading}</h3>
                  <div className="space-y-3 text-[14px] leading-relaxed text-ink/80">
                    {s.body.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
