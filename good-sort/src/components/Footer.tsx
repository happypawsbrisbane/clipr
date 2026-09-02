"use client";

import type { InfoTopic } from "@/lib/info";
import { useUI } from "@/lib/ui";
import { ArrowUpRightIcon } from "./Icons";
import { Wordmark } from "./Wordmark";

const SHOP = [
  { label: "Everything", filter: "all" as const },
  { label: "For Dogs", filter: "dogs" as const },
  { label: "For Humans", filter: "humans" as const },
  { label: "Walk Gear", filter: "walk" as const },
  { label: "Accessories", filter: "accessories" as const },
];

const HELP: { label: string; topic: InfoTopic }[] = [
  { label: "Shipping", topic: "shipping" },
  { label: "Returns", topic: "returns" },
  { label: "Sizing", topic: "sizing" },
  { label: "Contact", topic: "contact" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/goodsort.au" },
  { label: "TikTok", href: "https://www.tiktok.com/@goodsort.au" },
  { label: "Pinterest", href: "https://au.pinterest.com/goodsortau" },
];

export function Footer() {
  const { setFilter, openInfo } = useUI();
  const year = new Date().getFullYear();
  const col = "space-y-3 text-[14px]";
  return (
    <footer className="on-dark bg-ink px-5 pb-8 pt-16 text-chalk md:px-8 md:pt-24" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Footer
      </h2>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark className="text-[16vw] md:text-[6.5vw]" />
          <p className="label mt-5 text-chalk/60">Made for your kind.</p>
        </div>

        <nav className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-4" aria-label="Footer">
          <div>
            <p className="label mb-4 text-chalk/50">Shop</p>
            <ul className={col}>
              {SHOP.map((s) => (
                <li key={s.label}>
                  <a href="#shop" onClick={() => setFilter(s.filter)} className="link">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-4 text-chalk/50">Help</p>
            <ul className={col}>
              {HELP.map((h) => (
                <li key={h.topic}>
                  <button type="button" onClick={() => openInfo(h.topic)} className="link">
                    {h.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-4 text-chalk/50">Good Sort</p>
            <ul className={col}>
              <li>
                <a href="#story" className="link">
                  Our story
                </a>
              </li>
              <li>
                <a href="#community" className="link">
                  The campaign
                </a>
              </li>
              <li>
                <button type="button" onClick={() => openInfo("privacy")} className="link">
                  Privacy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => openInfo("terms")} className="link">
                  Terms
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="label mb-4 text-chalk/50">Follow</p>
            <ul className={col}>
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-flex items-center gap-1"
                  >
                    {s.label}
                    <ArrowUpRightIcon size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-chalk/15 pt-6 text-[12px] text-chalk/60 md:flex-row md:items-center md:justify-between">
        <p>GOOD SORT. Australian wearables for dogs &amp; humans. Est. 2024.</p>
        <p>
          &copy; {year} Good Sort. Designed in Brisbane. Prices in AUD, GST included.
        </p>
      </div>
    </footer>
  );
}
