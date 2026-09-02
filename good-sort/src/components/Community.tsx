"use client";

import { PRODUCT_BY_ID, type ColourKey } from "@/lib/catalogue";
import { useUI } from "@/lib/ui";
import { Frame } from "./Frame";
import { ArrowUpRightIcon } from "./Icons";
import { Reveal } from "./Reveal";

const POSTS: { handle: string; place: string; tone: ColourKey; src: string; productId: string }[] = [
  { handle: "@olive.and.jo", place: "New Farm, Brisbane", tone: "chalk", src: "/images/community-1.jpg", productId: "everyday-harness" },
  { handle: "@juno.mornings", place: "Fremantle, WA", tone: "chalk", src: "/images/community-2.jpg", productId: "all-weather-dog-jacket" },
  { handle: "@saltygoldie", place: "Torquay, Victoria", tone: "chalk", src: "/images/community-3.jpg", productId: "best-mate-cap" },
  { handle: "@teddy.longboy", place: "Paddington, Brisbane", tone: "chalk", src: "/images/community-4.jpg", productId: "good-sort-bandana" },
  { handle: "@mabel.walks", place: "Newtown, Sydney", tone: "chalk", src: "/images/community-5.jpg", productId: "walkabout-crossbody" },
  { handle: "@frankthebeagle", place: "Fitzroy, Melbourne", tone: "chalk", src: "/images/community-6.jpg", productId: "knockabout-overshirt" },
];

export function Community() {
  const { openQuickView } = useUI();
  return (
    <section id="community" className="py-20 md:py-28" aria-labelledby="community-title">
      <Reveal className="flex items-end justify-between px-5 md:px-8">
        <div>
          <p className="label text-ink/50">Community</p>
          <h2 id="community-title" className="display mt-3 text-[12vw] md:text-[5.5vw]">
            Spotted in Good Sort
          </h2>
        </div>
        <p className="label hidden text-ink/50 md:block">Tag us to be featured</p>
      </Reveal>

      <ul className="no-scrollbar mt-10 flex snap-x gap-3 overflow-x-auto px-5 md:grid md:grid-cols-6 md:gap-3 md:overflow-visible md:px-8">
        {POSTS.map((post, i) => {
          const product = PRODUCT_BY_ID[post.productId];
          return (
            <li key={post.handle} className="w-[62vw] shrink-0 snap-start sm:w-[40vw] md:w-auto">
              <Reveal delay={i * 0.05}>
                <button
                  type="button"
                  onClick={() => openQuickView({ product })}
                  className="group relative block aspect-[4/5] w-full overflow-hidden text-left"
                  aria-label={`${post.handle} in ${product.name}, ${post.place}. Shop the look`}
                >
                  <Frame
                    tone={post.tone}
                    src={post.src}
                    sizes="(min-width: 768px) 17vw, 62vw"
                    alt={`Photograph from ${post.handle} wearing ${product.name}`}
                    fill
            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    mark="md"
                  />
                  <div className="on-dark absolute inset-0 flex flex-col justify-end bg-ink/0 p-4 text-chalk opacity-0 transition-all duration-500 group-hover:bg-ink/45 group-hover:opacity-100 group-focus-visible:bg-ink/45 group-focus-visible:opacity-100">
                    <p className="text-[13px] font-medium">{post.handle}</p>
                    <p className="mt-0.5 text-[12px] text-chalk/80">{post.place}</p>
                    <p className="label mt-3 flex items-center gap-1.5">
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
