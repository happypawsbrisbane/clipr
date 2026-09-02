export type InfoTopic = "shipping" | "returns" | "sizing" | "contact" | "privacy" | "terms";

export type InfoContent = {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const INFO: Record<InfoTopic, InfoContent> = {
  shipping: {
    title: "Shipping",
    intro: "Everything ships from Brisbane with Australia Post.",
    sections: [
      {
        heading: "Australia",
        body: [
          "Free standard shipping on orders over $150. Otherwise $9.95 flat.",
          "Standard: 2 to 6 business days. Express: 1 to 3 business days, $14.95.",
          "Orders placed before 12 pm AEST on a business day leave the same day.",
        ],
      },
      {
        heading: "New Zealand and beyond",
        body: [
          "New Zealand from $19.95, 4 to 10 business days.",
          "We ship to most other countries at cost, calculated at checkout. Duties and taxes are the buyer's responsibility.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns",
    intro: "If it isn't right, send it back within 30 days.",
    sections: [
      {
        heading: "How it works",
        body: [
          "Unworn, unwashed items with tags attached can be returned for a refund or exchange within 30 days of delivery.",
          "Dog gear that has been out on a walk can be exchanged for size within 14 days as long as it comes back clean.",
          "Return postage within Australia is $9.95, deducted from your refund. Exchanges ship back free.",
        ],
      },
      {
        heading: "Faults",
        body: [
          "If something fails in normal use, we'll repair or replace it. Australian Consumer Law guarantees apply and nothing here limits them.",
        ],
      },
    ],
  },
  sizing: {
    title: "Sizing",
    intro: "Measure with a soft tape, snug but not tight, while they're standing.",
    sections: [
      {
        heading: "Harness, by chest girth",
        body: [
          "XS: 35 to 45 cm. S: 44 to 56 cm. M: 55 to 70 cm. L: 68 to 86 cm. XL: 84 to 104 cm.",
          "Chest girth is the widest point of the ribcage, just behind the front legs.",
          "Between sizes? Go up for deep-chested dogs and down for slim ones.",
        ],
      },
      {
        heading: "Jacket, by back length",
        body: [
          "XS: 25 to 30 cm. S: 30 to 36 cm. M: 36 to 44 cm. L: 44 to 54 cm. XL: 54 to 64 cm.",
          "Back length is measured from the base of the neck to the base of the tail.",
        ],
      },
      {
        heading: "Human apparel",
        body: [
          "The Oversized Tee is cut boxy with a dropped shoulder. Chest measurements: XS 112, S 118, M 124, L 130, XL 136, XXL 142 cm.",
          "The Best Mate Cap is one size with a brass slider, fitting 54 to 61 cm.",
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    intro: "A small team in Brisbane. We answer everything ourselves.",
    sections: [
      {
        heading: "Get in touch",
        body: [
          "Email hello@goodsort.com.au and we'll reply within one business day.",
          "For sizing help, send a photo of your dog and their measurements. It genuinely helps.",
          "Stockist and wholesale enquiries to the same address with 'Stockist' in the subject.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy",
    intro: "We collect what we need to fill your order and nothing else.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Your name, email, delivery address and order history. Payment details are handled by our payment provider and never touch our servers.",
          "If you join the list, your email address and the date you joined. You can leave any time using the link in every email.",
        ],
      },
      {
        heading: "What we don't do",
        body: [
          "We don't sell or share your details with anyone outside the people who deliver your order.",
          "We handle personal information in line with the Australian Privacy Principles. Ask us at any time to see or delete what we hold.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    intro: "The short version, in plain language.",
    sections: [
      {
        heading: "Orders",
        body: [
          "All prices are in Australian dollars and include GST. An order is accepted when we send a shipping confirmation.",
          "If something is out of stock after you've paid, we'll refund it in full straight away.",
        ],
      },
      {
        heading: "Use of the site",
        body: [
          "Photography, the wordmark and the interlocking OO mark belong to Good Sort. Please ask before using them.",
          "These terms are governed by the laws of Queensland, Australia.",
        ],
      },
    ],
  },
};
