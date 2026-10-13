export const COLOURS = {
  oxblood: { name: "Oxblood", hex: "#6E2033" },
  chalk: { name: "Chalk", hex: "#F5F0E7" },
  denim: { name: "Denim", hex: "#2E4B6B" },
  powder: { name: "Powder", hex: "#B9CFD4" },
  citron: { name: "Citron", hex: "#D7E04B" },
  ink: { name: "Ink", hex: "#191817" },
} as const;

export type ColourKey = keyof typeof COLOURS;

/** Tones that need light text on top. */
export const DARK_TONES: ReadonlySet<ColourKey> = new Set(["oxblood", "denim", "ink"]);

export type Kind = "dogs" | "humans" | "walk" | "apparel" | "accessories";

export const KIND_LABELS: Record<Kind, string> = {
  dogs: "For Dogs",
  humans: "For Humans",
  walk: "Walk Gear",
  apparel: "Apparel",
  accessories: "Accessories",
};

export type Badge = "new" | "sold-out";

export type Product = {
  id: string;
  name: string;
  priceCents: number;
  kinds: Kind[];
  colours: ColourKey[];
  sizes: string[];
  sizeNote?: string;
  badge?: Badge;
  soldOut?: boolean;
  blurb: string;
  details: string[];
  /**
   * Photography for the piece.
   *
   * `base` names the colourway that went in front of the camera; the rest of
   * `stills` are that photograph repainted per colourway, so selecting a swatch
   * changes the picture. `tone` is the ground colour of the shoot, painted
   * behind the image and used as the fallback panel if a `src` is ever dropped.
   * `worn` is the second view and exists only in the base colourway, so it is
   * shown only while the base colourway is selected.
   */
  images: {
    base: ColourKey;
    tone: ColourKey;
    stills: Partial<Record<ColourKey, string>>;
    worn?: { tone: ColourKey; src: string };
  };
};

export const PRODUCTS: Product[] = [
  {
    id: "everyday-harness",
    name: "The Everyday Harness",
    priceCents: 8900,
    kinds: ["dogs", "walk"],
    colours: ["oxblood", "denim", "citron"],
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeNote: "Sized by chest girth. See the sizing guide.",
    badge: "new",
    blurb:
      "A Y-front harness that sits off the shoulders so the walk feels like theirs. Soft-backed webbing, a front and back clip, and a handle you'll be glad of at the crossing.",
    details: [
      "Recycled polyester webbing, brushed backing",
      "Front and back D-rings, top grab handle",
      "Four points of adjustment",
      "Machine washable, cold",
    ],
    images: {
      base: "oxblood",
      tone: "chalk",
      stills: {
        oxblood: "/images/harness.jpg",
        denim: "/images/harness-denim.jpg",
        citron: "/images/harness-citron.jpg",
      },
      worn: { tone: "denim", src: "/images/harness-worn.jpg" },
    },
  },
  {
    id: "kindred-rope-lead",
    name: "Kindred Rope Lead",
    priceCents: 6900,
    kinds: ["walk", "accessories"],
    colours: ["citron", "oxblood", "denim", "powder"],
    sizes: ["120 cm", "180 cm"],
    blurb:
      "Twelve millimetre climbing rope with a leather-bound handle that softens the more you use it. Weighty enough to feel like something, light enough for a long one.",
    details: [
      "12 mm braided rope, solid brass snap hook",
      "Vegetable-tanned leather binding",
      "Colour-matched to the Everyday Harness",
      "Made to be handed down",
    ],
    images: {
      base: "citron",
      tone: "chalk",
      stills: {
        citron: "/images/lead.jpg",
        oxblood: "/images/lead-oxblood.jpg",
        denim: "/images/lead-denim.jpg",
        powder: "/images/lead-powder.jpg",
      },
      worn: { tone: "chalk", src: "/images/lead-worn.jpg" },
    },
  },
  {
    id: "oversized-tee",
    name: "Good Sort Oversized Tee",
    priceCents: 7900,
    kinds: ["humans", "apparel"],
    colours: ["chalk", "ink", "oxblood"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    sizeNote: "Boxy, dropped shoulder. Size down for a closer fit.",
    blurb:
      "Heavyweight organic cotton with the GS monogram at the chest and nothing else to say. Cut to sit long and loose over whatever you walked out the door in.",
    details: [
      "240 gsm organic cotton jersey",
      "Dropped shoulder, ribbed collar",
      "Embroidered chest mark",
      "Garment washed, pre-shrunk",
    ],
    images: {
      base: "chalk",
      tone: "powder",
      // TODO(future): ink and oxblood are waiting on a camera. Repainting the
      // chalk tee would swallow the oxblood monogram along with the body.
      stills: { chalk: "/images/tee.jpg" },
      worn: { tone: "denim", src: "/images/tee-worn.jpg" },
    },
  },
  {
    id: "best-mate-cap",
    name: "Best Mate Cap",
    priceCents: 5900,
    kinds: ["humans", "apparel", "accessories"],
    colours: ["denim", "ink"],
    sizes: ["One size"],
    blurb:
      "An unstructured six-panel cap in brushed cotton twill with a low profile and a brass slider. Sun-faded on purpose after one good summer.",
    details: [
      "Brushed cotton twill, unstructured crown",
      "Solid brass adjuster",
      "Embroidered GS monogram",
      "One size, fits most",
    ],
    images: {
      base: "denim",
      tone: "powder",
      // TODO(future): ink is waiting on a camera. The denim cap repainted dark
      // loses the chalk monogram's contrast.
      stills: { denim: "/images/cap.jpg" },
      worn: { tone: "chalk", src: "/images/cap-worn.jpg" },
    },
  },
  {
    id: "all-weather-dog-jacket",
    name: "All Weather Dog Jacket",
    priceCents: 10900,
    kinds: ["dogs", "apparel"],
    colours: ["powder", "oxblood", "denim"],
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeNote: "Sized by back length. See the sizing guide.",
    badge: "sold-out",
    soldOut: true,
    blurb:
      "Waxed cotton shell, quilted lining and a harness opening at the back. For the winter mornings that are still worth getting up for.",
    details: [
      "Waxed organic cotton, quilted recycled fill",
      "Harness access at the back",
      "Adjustable chest and belly straps",
      "Reflective piping at the hem",
    ],
    images: {
      base: "powder",
      tone: "chalk",
      stills: {
        powder: "/images/dog-jacket.jpg",
        oxblood: "/images/dog-jacket-oxblood.jpg",
        denim: "/images/dog-jacket-denim.jpg",
      },
      worn: { tone: "chalk", src: "/images/dog-jacket-worn.jpg" },
    },
  },
  {
    id: "walkabout-crossbody",
    name: "Walkabout Crossbody Bag",
    priceCents: 8900,
    kinds: ["humans", "walk", "accessories"],
    colours: ["chalk", "ink", "oxblood", "powder"],
    sizes: ["One size"],
    blurb:
      "Keys, phone, treats, bags, a ball. A crossbody with a dedicated pocket for each so you stop patting yourself down at the park gate.",
    details: [
      "Recycled nylon canvas, water resistant",
      "Bag dispenser pocket with pull-through",
      "Wipe-clean treat pocket",
      "Adjustable webbing strap, 2 L",
    ],
    images: {
      base: "chalk",
      tone: "powder",
      // TODO(future): the ink, oxblood and powder bags are waiting on a camera.
      // Their generated stills were repaints of the previous, unbranded sample
      // and tinted the hardware with the canvas, so they have been removed and
      // those swatches fall back to the photographed chalk.
      stills: { chalk: "/images/bag.jpg" },
      worn: { tone: "chalk", src: "/images/bag-worn.jpg" },
    },
  },
  {
    id: "knockabout-overshirt",
    name: "Knockabout Overshirt",
    priceCents: 18900,
    kinds: ["humans", "apparel"],
    colours: ["oxblood", "ink"],
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeNote: "Relaxed through the body. Take your usual size.",
    badge: "new",
    blurb:
      "Garment-dyed cotton twill that softens with every wash, cut to throw on over the tee when the wind turns. Two chest pockets, two hip pockets, and room for a lead in each.",
    details: [
      "Garment-dyed organic cotton twill",
      "Four pockets, antique brass shanks",
      "Drops slightly at the back hem",
      "Softens and fades with wear",
    ],
    images: {
      base: "oxblood",
      tone: "powder",
      stills: { oxblood: "/images/overshirt.jpg", ink: "/images/overshirt-ink.jpg" },
      worn: { tone: "chalk", src: "/images/overshirt-worn.jpg" },
    },
  },
  {
    id: "good-sort-bandana",
    name: "Good Sort Bandana",
    priceCents: 3500,
    kinds: ["dogs", "accessories"],
    colours: ["oxblood", "powder", "citron"],
    sizes: ["S/M", "L/XL"],
    blurb:
      "A classic triangle bandana in washed cotton with a chalk edge stripe. Knots at the neck or over their collar, and softens with every wash.",
    details: [
      "Washed organic cotton poplin",
      "Chalk edge stripe",
      "Knots at the neck or over a collar",
      "Pairs with the Oversized Tee",
    ],
    images: {
      base: "oxblood",
      tone: "chalk",
      stills: {
        oxblood: "/images/bandana.jpg",
        powder: "/images/bandana-powder.jpg",
        citron: "/images/bandana-citron.jpg",
      },
      worn: { tone: "chalk", src: "/images/bandana-alt.jpg" },
    },
  },
];

/** The still for a colourway, falling back to the photographed one. */
export function stillFor(product: Product, colour: ColourKey): string | undefined {
  return product.images.stills[colour] ?? product.images.stills[product.images.base];
}

/** The colourway a still actually shows, which is the base one when it fell back. */
export function depictedColour(product: Product, colour: ColourKey): ColourKey {
  return product.images.stills[colour] ? colour : product.images.base;
}

/** Alt text for a still, which must describe the photograph and not the swatch. */
export function stillAlt(product: Product, colour: ColourKey): string {
  const shown = depictedColour(product, colour);
  return shown === colour
    ? `${product.name} in ${COLOURS[colour].name}`
    : `${product.name}, photographed in ${COLOURS[shown].name}`;
}

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

/** The order the collection leads with. It sets order, not membership. */
export const FEATURED_IDS = [
  "everyday-harness",
  "kindred-rope-lead",
  "knockabout-overshirt",
  "oversized-tee",
  "best-mate-cap",
  "all-weather-dog-jacket",
  "walkabout-crossbody",
];

/**
 * Every piece, led by the featured order, with anything else appended. Built
 * this way so a new product shows up under "Everything" without being added to
 * two lists: leaving it out of FEATURED_IDS changes where it sits, not whether
 * it can be found.
 */
export const COLLECTION: Product[] = [
  ...FEATURED_IDS.map((id) => PRODUCT_BY_ID[id]),
  ...PRODUCTS.filter((p) => !FEATURED_IDS.includes(p.id)),
];

export const WALK_SET_IDS = [
  "everyday-harness",
  "kindred-rope-lead",
  "good-sort-bandana",
  "walkabout-crossbody",
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;

export function filterProducts(products: Product[], kind: Kind | "all"): Product[] {
  if (kind === "all") return products;
  return products.filter((p) => p.kinds.includes(kind));
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) => {
    const hay = [p.name, p.blurb, ...p.kinds.map((k) => KIND_LABELS[k]), ...p.colours.map((c) => COLOURS[c].name)]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((word) => hay.includes(word));
  });
}
