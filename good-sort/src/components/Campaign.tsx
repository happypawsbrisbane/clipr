"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Frame } from "./Frame";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";

export function Campaign() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yLeft = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);
  const yRight = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  return (
    <section ref={ref} className="on-dark relative overflow-hidden text-chalk" aria-labelledby="campaign-title">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[90vh]">
          <motion.div style={{ y: yLeft }} className="absolute -inset-y-12 inset-x-0 will-change-transform">
            <Frame
              tone="chalk"
              src="/images/campaign-human.jpg"
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="A person in the Knockabout Overshirt over the Good Sort Oversized Tee"
              className="h-full w-full"
              mark="lg"
            />
          </motion.div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[90vh]">
          <motion.div style={{ y: yRight }} className="absolute -inset-y-12 inset-x-0 will-change-transform">
            <Frame
              tone="powder"
              src="/images/campaign-dog.jpg"
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="Their dog on the lead in the All Weather Dog Jacket"
              className="h-full w-full"
              mark="lg"
            />
          </motion.div>
        </div>
      </div>

      {/* The headline sits over photography, so it needs its own ground. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/15 md:bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(25,24,23,0.72),rgba(25,24,23,0.28)_70%,rgba(25,24,23,0.15))]"
      />

      <div className="pointer-events-none absolute inset-0 flex items-end md:items-center">
        <Reveal className="pointer-events-auto w-full px-5 pb-10 md:px-8 md:pb-0">
          <div className="max-w-2xl md:mx-auto md:text-center">
            <h2 id="campaign-title" className="display text-[16vw] md:text-[8vw]">
              Good together.
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-snug text-chalk/90 md:mx-auto md:text-[19px]">
              Considered essentials for walks, weekends and the everyday adventures in between.
            </p>
            <div className="mt-8">
              <MagneticButton href="#the-walk" variant="chalk">
                Shop matching sets
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
