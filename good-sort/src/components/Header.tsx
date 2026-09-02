"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";
import { AccountIcon, BagIcon, MenuIcon, SearchIcon } from "./Icons";
import { useUI } from "@/lib/ui";
import { useCart } from "@/lib/cart";
import type { Kind } from "@/lib/catalogue";

export const NAV: { label: string; href: string; filter?: Kind | "all" }[] = [
  { label: "Shop", href: "#shop", filter: "all" },
  { label: "Apparel", href: "#shop", filter: "apparel" },
  { label: "Walk Gear", href: "#shop", filter: "walk" },
  { label: "Accessories", href: "#shop", filter: "accessories" },
  { label: "Our Story", href: "#story" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openMenu, openSearch, openCart, setFilter, notify } = useUI();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-current/10";

  return (
    <div className={`fixed inset-x-0 top-0 z-40 ${scrolled ? "" : "on-dark"}`}>
      <div
        className={`overflow-hidden bg-ink text-chalk transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "max-h-0" : "max-h-10"
        }`}
      >
        <p className="label px-5 py-2.5 text-center">Free Australian shipping over $150</p>
      </div>

      <header
        className={`transition-[background-color,color,border-color] duration-500 ${
          scrolled
            ? "border-b border-ink/10 bg-chalk/95 text-ink backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-chalk"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-3 md:h-[72px] md:px-8">
          <div className="flex items-center gap-1 md:hidden">
            <button type="button" className={iconBtn} onClick={openMenu} aria-label="Open menu">
              <MenuIcon size={22} />
            </button>
          </div>

          <a href="#top" className="flex items-center" aria-label="Good Sort, back to top">
            <Wordmark className="text-[22px] md:text-[24px]" />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => item.filter && setFilter(item.filter)}
                    className="link label py-2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5">
            <button type="button" className={iconBtn} onClick={openSearch} aria-label="Search">
              <SearchIcon />
            </button>
            <a
              href="#join"
              className={`${iconBtn} hidden md:inline-flex`}
              aria-label="Account. Accounts open with the first drop; join the list"
              onClick={() => notify("Accounts open with the first drop. Join the list to hear first.")}
            >
              <AccountIcon />
            </a>
            <button
              type="button"
              className={`${iconBtn} relative`}
              onClick={openCart}
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <BagIcon />
              <span
                aria-hidden="true"
                className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums transition-all duration-300 ${
                  scrolled ? "bg-ink text-chalk" : "bg-chalk text-ink"
                } ${count === 0 ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
