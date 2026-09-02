"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

const LINES = ["For dogs.", "For humans.", "For good sorts."];

export function BrandStatement() {
  const reduce = useReducedMotion();
  return (
    <section id="story" className="scroll-mt-16 px-5 py-24 md:px-8 md:py-36" aria-labelledby="story-title">
      <h2 id="story-title" className="sr-only">
        Our story
      </h2>
      <div aria-hidden="true">
        {LINES.map((line, i) => (
          // The observer sits on the clipping wrapper: a line translated out of
          // it would never intersect the viewport and never animate in.
          <motion.div
            key={line}
            className="overflow-hidden"
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          >
            <motion.p
              className={`display text-[11.5vw] uppercase md:text-[9.5vw] ${i === 2 ? "text-oxblood" : ""}`}
              variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.p>
          </motion.div>
        ))}
      </div>
      <p className="sr-only">For dogs. For humans. For good sorts.</p>

      <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="label text-ink/50">The idea</p>
        </Reveal>
        <Reveal className="md:col-span-6" delay={0.1}>
          <p className="text-[19px] leading-snug md:text-[24px]">
            Good Sort started with a dachshund, a rope lead that kept slipping and a tee that got
            ruined by a muddy paw. So we made better ones. The collection brings together
            comfortable materials, practical details and considered design, so what your dog wears
            and what you wear were clearly made by the same people, with the same care, for the
            same walk.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-ink/70">
            Designed in Brisbane. Made in small runs. Sized for the dogs we actually know, from
            long-backed to barrel-chested.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
