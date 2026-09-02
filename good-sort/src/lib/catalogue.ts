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
   * Image slots. `worn` is the second view, shown on hover; omit it for a piece
   * that has not been shot in use yet. `tone` is the ground colour behind the
   * photograph, and the fallback panel if `src` is ever dropped.
   */
  images: {
    still: { tone: ColourKey; src?: string };
    worn?: { tone: ColourKey; src?: string };
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
      still: { tone: "chalk", src: "/images/harness.jpg" },
      worn: { tone: "denim", src: "/images/harness-worn.jpg" },
    },
  },
  {
    id: "kindred-rope-lead",
    name: "Kindred Rope Lead",
    priceCents: 6900,
    kinds: ["walk", "accessories"],
    colours: ["oxblood", "denim", "powder", "citron"],
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
      still: { tone: "chalk", src: "/images/lead.jpg" },
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
      "Heavyweight organic cotton with the interlocking OO at the chest and nothing else to say. Cut to sit long and loose over whatever you walked out the door in.",
    details: [
      "240 gsm organic cotton jersey",
      "Dropped shoulder, ribbed collar",
      "Embroidered chest mark",
      "Garment washed, pre-shrunk",
    ],
    images: {
      still: { tone: "powder", src: "/images/tee.jpg" },
      worn: { tone: "denim", src: "/images/tee-worn.jpg" },
    },
  },
  {
    id: "best-mate-cap",
    name: "Best Mate Cap",
    priceCents: 5900,
    kinds: ["humans", "apparel", "accessories"],
    colours: ["ink", "denim", "chalk"],
    sizes: ["One size"],
    blurb:
      "An unstructured six-panel cap in brushed cotton twill with a low profile and a brass slider. Sun-faded on purpose after one good summer.",
    details: [
      "Brushed cotton twill, unstructured crown",
      "Solid brass adjuster",
      "Tonal embroidered wordmark",
      "One size, fits most",
    ],
    images: {
      still: { tone: "powder", src: "/images/cap.jpg" },
      worn: { tone: "chalk", src: "/images/cap-worn.jpg" },
    },
  },
  {
    id: "all-weather-dog-jacket",
    name: "All Weather Dog Jacket",
    priceCents: 10900,
    kinds: ["dogs", "apparel"],
    colours: ["oxblood", "denim"],
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
      still: { tone: "chalk", src: "/images/dog-jacket.jpg" },
      worn: { tone: "chalk", src: "/images/dog-jacket-worn.jpg" },
    },
  },
  {
    id: "walkabout-crossbody",
    name: "Walkabout Crossbody Bag",
    priceCents: 8900,
    kinds: ["humans", "walk", "accessories"],
    colours: ["ink", "oxblood", "powder"],
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
      still: { tone: "powder", src: "/images/bag.jpg" },
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
      still: { tone: "powder", src: "/images/overshirt.jpg" },
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
      "A slip-on bandana that threads through their collar so it stays put. Washed cotton, tonal wordmark, no ties to chew.",
    details: [
      "Washed organic cotton poplin",
      "Collar loop, no ties",
      "Tonal woven label",
      "Pairs with the Oversized Tee",
    ],
    images: {
      still: { tone: "chalk", src: "/images/bandana.jpg" },
      worn: { tone: "chalk", src: "/images/bandana-alt.jpg" },
    },
  },
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export const FEATURED_IDS = [
  "everyday-harness",
  "kindred-rope-lead",
  "knockabout-overshirt",
  "oversized-tee",
  "best-mate-cap",
  "all-weather-dog-jacket",
  "walkabout-crossbody",
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
