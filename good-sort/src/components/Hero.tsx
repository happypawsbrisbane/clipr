"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Frame } from "./Frame";
import { MagneticButton } from "./MagneticButton";
import { Wordmark } from "./Wordmark";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: EASE },
        };

  return (
    <section
      ref={ref}
      id="top"
      className="on-dark relative min-h-[100svh] overflow-hidden bg-oxblood text-chalk"
      aria-label="Introduction"
    >
      <motion.div style={{ y }} className="absolute inset-0 -bottom-[18%] will-change-transform">
        <Frame
          tone="ink"
          src="/images/hero-mobile.jpg"
          sizes="100vw"
          quality={80}
          position="52% 38%"
          alt="A person walking their golden retriever, the dog in the All Weather Jacket and the Kindred Rope Lead in hand"
          className="h-full w-full md:hidden"
          mark="none"
          priority
        />
        <Frame
          tone="ink"
          src="/images/hero-desktop.jpg"
          sizes="100vw"
          quality={82}
          position="70% 50%"
          alt="A person and their golden retriever in coordinated Good Sort pieces, the dog in the Everyday Harness"
          className="hidden h-full w-full md:block"
          mark="none"
          priority
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/35 md:from-ink/70 md:via-ink/15 md:to-ink/30"
        style={{ opacity: fade }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-32 md:px-8 md:pb-12 md:pt-40">
        <motion.p {...enter(0.2)} className="label max-w-xs text-chalk/80 md:ml-auto md:text-right">
          Australian wearables
          <br />
          for dogs &amp; humans
          <br />
          Est. 2024
        </motion.p>

        <div>
          <motion.div {...enter(0.35)}>
            <Wordmark className="block text-[16vw] md:text-[15vw]" />
          </motion.div>
          <div className="mt-4 grid gap-8 md:mt-6 md:grid-cols-12 md:items-end">
            <motion.h1 {...enter(0.45)} className="display text-[9.5vw] md:col-span-7 md:text-[4.2vw]">
              Made for your kind.
            </motion.h1>
            <motion.div {...enter(0.55)} className="max-w-sm md:col-span-5 md:justify-self-end md:pb-2">
              <p className="text-[17px] leading-snug text-chalk/90 md:text-[19px]">
                Good-looking gear for dogs, humans and everywhere you go together.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <MagneticButton href="#shop" variant="chalk">
                  Shop the collection
                </MagneticButton>
                <a href="#story" className="link label">
                  Meet Good Sort
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
