"use client";

import type { Kind } from "@/lib/catalogue";
import { useUI } from "@/lib/ui";
import { Frame } from "./Frame";
import { ArrowRightIcon } from "./Icons";
import { Reveal } from "./Reveal";

const CARDS: {
  kind: Kind;
  title: string;
  line: string;
  tone: "denim" | "powder" | "citron" | "oxblood" | "ink" | "chalk";
  className: string;
  ratio: string;
}[] = [
  {
    kind: "dogs",
    title: "For Dogs",
    line: "Harnesses, jackets and the bandana they'll keep on.",
    tone: "denim",
    className: "md:col-span-7",
    ratio: "aspect-[4/5]",
  },
  {
    kind: "humans",
    title: "For Humans",
    line: "Tees and caps that go with the dog.",
    tone: "powder",
    className: "md:col-span-5 md:mt-24",
    ratio: "aspect-[3/4]",
  },
  {
    kind: "walk",
    title: "Walk Gear",
    line: "Leads, bags and everything for the door.",
    tone: "citron",
    className: "md:col-span-8 md:col-start-5 md:-mt-10",
    ratio: "aspect-[16/10]",
  },
];

export function ShopByKind() {
  const { setFilter } = useUI();
  return (
    <section id="kinds" className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="kinds-title">
      <Reveal className="mb-10 flex items-end justify-between md:mb-14">
        <h2 id="kinds-title" className="display text-[12vw] md:text-[5.5vw]">
          Shop by kind
        </h2>
        <p className="label hidden text-ink/50 md:block">Three ways in</p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
        {CARDS.map((card, i) => (
          <Reveal key={card.kind} className={card.className} delay={i * 0.08}>
            <a
              href="#shop"
              onClick={() => setFilter(card.kind)}
              className="group block"
              aria-label={`${card.title}. ${card.line}`}
            >
              <div className={`relative overflow-hidden ${card.ratio}`}>
                <Frame
                  tone={card.tone}
                  alt={`Editorial photograph for ${card.title}`}
                  caption={`${card.title} · Photography to follow`}
                  fill
            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  mark="lg"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h3 className="display text-3xl md:text-4xl">{card.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/60">{card.line}</p>
                </div>
                <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:bg-ink group-hover:text-chalk">
                  <ArrowRightIcon size={18} className="transition-transform duration-500 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
