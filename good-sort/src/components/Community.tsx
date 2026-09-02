"use client";

import { PRODUCT_BY_ID } from "@/lib/catalogue";
import { useUI } from "@/lib/ui";
import { Frame } from "./Frame";
import { ArrowUpRightIcon } from "./Icons";
import { Reveal } from "./Reveal";

/*
 * Campaign imagery, not customer photographs. The strip was written as a
 * user-generated row with invented handles and locations; there are no real
 * customer photographs yet, so it presents these as what they are — frames from
 * the campaign shoot — and each one links to the piece it shows. When genuine
 * customer content exists, this becomes "Spotted in Good Sort" again with
 * credited handles.
 */
const FRAMES: { id: string; caption: string; src: string; productId: string }[] = [
  { id: "f1", caption: "Campaign 01", src: "/images/community-1.jpg", productId: "everyday-harness" },
  { id: "f2", caption: "Campaign 02", src: "/images/community-2.jpg", productId: "all-weather-dog-jacket" },
  { id: "f3", caption: "Campaign 03", src: "/images/community-3.jpg", productId: "best-mate-cap" },
  { id: "f4", caption: "Campaign 04", src: "/images/community-4.jpg", productId: "good-sort-bandana" },
  { id: "f5", caption: "Campaign 05", src: "/images/community-5.jpg", productId: "walkabout-crossbody" },
  { id: "f6", caption: "Campaign 06", src: "/images/community-6.jpg", productId: "knockabout-overshirt" },
];

export function Community() {
  const { openQuickView } = useUI();
  return (
    <section id="community" className="py-20 md:py-28" aria-labelledby="community-title">
      <Reveal className="flex items-end justify-between px-5 md:px-8">
        <div>
          <p className="label text-ink/50">The campaign</p>
          <h2 id="community-title" className="display mt-3 text-[12vw] md:text-[5.5vw]">
            Out and about
          </h2>
        </div>
        <p className="label hidden text-ink/50 md:block">Shot in Brisbane</p>
      </Reveal>

      <ul className="no-scrollbar mt-10 flex snap-x gap-3 overflow-x-auto px-5 md:grid md:grid-cols-6 md:gap-3 md:overflow-visible md:px-8">
        {FRAMES.map((frame, i) => {
          const product = PRODUCT_BY_ID[frame.productId];
          return (
            <li key={frame.id} className="w-[62vw] shrink-0 snap-start sm:w-[40vw] md:w-auto">
              <Reveal delay={i * 0.05}>
                <button
                  type="button"
                  onClick={() => openQuickView({ product })}
                  className="group relative block aspect-[4/5] w-full overflow-hidden text-left"
                  aria-label={`Campaign photograph featuring the ${product.name}. Open quick view`}
                >
                  <Frame
                    tone="chalk"
                    src={frame.src}
                    sizes="(min-width: 768px) 17vw, 62vw"
                    alt={`Campaign photograph featuring the ${product.name}`}
                    fill
                    className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    mark="md"
                  />
                  <div className="on-dark absolute inset-0 flex flex-col justify-end bg-ink/0 p-4 text-chalk opacity-0 transition-all duration-500 group-hover:bg-ink/45 group-hover:opacity-100 group-focus-visible:bg-ink/45 group-focus-visible:opacity-100">
                    <p className="label text-chalk/70">{frame.caption}</p>
                    <p className="label mt-2 flex items-center gap-1.5">
                      Shop {product.name}
                      <ArrowUpRightIcon size={14} />
                    </p>
                  </div>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
