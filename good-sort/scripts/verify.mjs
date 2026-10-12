/**
 * Browser pass over the storefront: every width, plus a reduced-motion run.
 *
 * Checks the things that break quietly — console errors, failed requests,
 * horizontal overflow, images that load no pixels, the dialogs opening and
 * closing on the keyboard, swatches repainting the shot, and copy that is
 * still invisible once its animation should have finished.
 *
 * Needs a build serving on BASE (default http://127.0.0.1:3000):
 * `pnpm build && pnpm start` in one shell, `pnpm verify` in another. Point
 * CHROMIUM_PATH or PLAYWRIGHT_BROWSERS_PATH at a Chromium if the default misses.
 */

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const SETTLE = 900;

import { readdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

/** playwright-core ships no browsers, so find the one already on the machine. */
const findChromium = () => {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  const dir = readdirSync(root).find((d) => /^chromium-\d+$/.test(d)) ?? "chromium";
  return path.join(root, dir, "chrome-linux", "chrome");
};

const problems = [];
const note = (where, msg) => problems.push(`[${where}] ${msg}`);

const watch = (page, where) => {
  page.on("console", (m) => m.type() === "error" && note(where, `console error: ${m.text()}`));
  page.on("pageerror", (e) => note(where, `page error: ${e.message}`));
  page.on("requestfailed", (r) => note(where, `request failed: ${r.url()} (${r.failure()?.errorText})`));
  page.on("response", (r) => r.status() >= 400 && note(where, `HTTP ${r.status()} ${r.url()}`));
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? findChromium() });

for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "phone", width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  watch(page, vp.name);
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Walk the page so every section mounts and every image is asked for.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(SETTLE);

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    if (doc.scrollWidth <= window.innerWidth + 1) return null;
    const culprits = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const ox = getComputedStyle(el).overflowX;
        return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1) && ox !== "auto" && ox !== "scroll";
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
    return `${doc.scrollWidth} > ${window.innerWidth} (${culprits.join(", ")})`;
  });
  if (overflow) note(vp.name, `horizontal overflow: ${overflow}`);

  const blank = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  if (blank.length) note(vp.name, `images loaded no pixels: ${blank.slice(0, 6).join(", ")}`);

  const invisible = await page.evaluate(() =>
    [...document.querySelectorAll("h1, h2, h3, p, a, button")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0 || r.width === 0) return false;
        // Hover-only overlays are meant to sit at 0 until pointed at.
        return getComputedStyle(el).opacity === "0" && !el.closest(".group");
      })
      .map((el) => (el.textContent || "").trim().slice(0, 40)),
  );
  if (invisible.length) note(vp.name, `in-view copy still at opacity 0: ${invisible.join(" | ")}`);

  // Swatches repaint the shot. On desktop, walk every swatch of every card so
  // each colourway image is actually fetched and seen to decode; a missing or
  // mis-keyed still shows up here rather than on the shop.
  const cards = page.locator("article");
  const cardCount = await cards.count();
  if (cardCount === 0) note(vp.name, "no product cards found");
  const limit = vp.name === "desktop" ? cardCount : 1;
  for (let c = 0; c < limit; c++) {
    const card = cards.nth(c);
    const name = ((await card.locator("h3").first().textContent()) ?? `card ${c + 1}`).trim();
    const swatches = card.locator('[role="radio"]');
    const n = await swatches.count();
    if (n < 2) {
      note(vp.name, `${name} exposes ${n} swatch control(s)`);
      continue;
    }
    const seen = new Set();
    for (let i = 0; i < n; i++) {
      await swatches.nth(i).click();
      await page.waitForTimeout(450);
      const img = card.locator("img").first();
      const src = await img.getAttribute("src");
      seen.add(src);
      const painted = await img.evaluate((el) => el.complete && el.naturalWidth > 0);
      if (!painted) note(vp.name, `${name}: swatch ${i + 1} shows an image with no pixels (${src})`);
    }
    if (seen.size < 2) note(vp.name, `${name}: every swatch shows the same image`);
  }

  // Nothing a filter can show may be missing from "Everything".
  if (vp.name === "desktop") {
    const names = async () =>
      (await cards.allTextContents()).map((t) => t.trim().split("\n")[0]).filter(Boolean);
    const chips = page.getByRole("group", { name: /filter the collection/i }).getByRole("button");
    const labels = await chips.allTextContents();
    await chips.first().click();
    await page.waitForTimeout(500);
    const everything = new Set(await names());
    for (let i = 1; i < labels.length; i++) {
      await chips.nth(i).click();
      await page.waitForTimeout(500);
      const missing = (await names()).filter((n) => !everything.has(n));
      if (missing.length) {
        note(vp.name, `"${labels[i].trim()}" shows pieces that "Everything" hides: ${missing.join(", ")}`);
      }
    }
    await chips.first().click();
    await page.waitForTimeout(500);
  }

  // Each dialog, opened from a settled page and closed on Escape.
  for (const [label, name] of [
    ["bag", /^(open )?bag/i],
    ["quick view", /^quick view/i],
    ["search", /search/i],
    ...(vp.width < 768 ? [["menu", /menu/i]] : []),
  ]) {
    const opener = page.getByRole("button", { name }).first();
    if (!(await opener.count())) {
      note(vp.name, `no ${label} button found`);
      continue;
    }
    await opener.click();
    await page.waitForTimeout(700);
    const dialog = page.locator('[role="dialog"]');
    if (!(await dialog.count())) {
      note(vp.name, `${label} opened no dialog`);
      continue;
    }
    const inside = await page.evaluate(() =>
      document.querySelector('[role="dialog"]')?.contains(document.activeElement) ?? false,
    );
    if (!inside) note(vp.name, `${label} opened without moving focus into it`);
    if ((await page.evaluate(() => document.body.style.overflow)) !== "hidden") {
      note(vp.name, `${label} left the page behind it scrollable`);
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1600);
    if (await dialog.count()) note(vp.name, `${label} did not close on Escape`);
  }

  // The newsletter rejects a bad address and says so.
  const email = page.locator("#newsletter-email");
  await email.scrollIntoViewIfNeeded();
  await email.fill("not-an-email");
  await page.getByRole("button", { name: /join the list/i }).click();
  await page.waitForTimeout(400);
  if (!(await page.locator("#newsletter-error").count())) note(vp.name, "invalid email accepted without an error");
  if ((await email.getAttribute("aria-invalid")) !== "true") note(vp.name, "aria-invalid not set on the email field");

  await ctx.close();
}

// Reduced motion: nothing should animate, and nothing should stay hidden.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  watch(page, "reduced-motion");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(SETTLE);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll("#top h1, #top p, #top a, #top svg")]
      .filter((el) => getComputedStyle(el).opacity === "0" || getComputedStyle(el.parentElement).opacity === "0")
      .map((el) => (el.textContent || el.tagName).trim().slice(0, 40)),
  );
  if (hidden.length) note("reduced-motion", `hero content hidden: ${hidden.join(" | ")}`);
  await ctx.close();
}

await browser.close();

if (problems.length) {
  console.error(`${problems.length} finding(s):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("Storefront verified: 1440 / 834 / 390 and reduced motion, no findings.");
