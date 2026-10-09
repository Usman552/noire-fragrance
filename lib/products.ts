/**
 * Product catalogue.
 *
 * This is the single source of truth for the storefront. Everything the UI
 * shows — and every price the cart computes — is derived from here, so a real
 * backend can replace this module with an API client that returns the same
 * shapes without touching the interface.
 *
 * All products are fictional. Prices are in Pakistani Rupees (PKR).
 */

export type NoteTier = "top" | "heart" | "base";

export interface FragranceNote {
  id: string;
  name: string;
  tier: NoteTier;
  /** One sensory line used in the notes section and on the detail page. */
  description: string;
}

export interface ProductSize {
  id: string;
  label: string;
  ml: number;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Short name used on the bottle label. */
  shortName: string;
  concentration: string;
  family: string;
  tagline: string;
  description: string;
  story: string;
  sizes: ProductSize[];
  defaultSizeId: string;
  notes: FragranceNote[];
  bestseller: boolean;
}

export const products: Product[] = [
  {
    id: "oud",
    slug: "noire-oud",
    name: "NOIRÉ Oud",
    shortName: "OUD",
    concentration: "Eau de Parfum",
    family: "Woody Amber",
    tagline: "Smoke, resin and a trace of light.",
    description:
      "Our signature. Cold bergamot opens onto dry cedarwood before a deep heart of oud settles into warm amber and dark vanilla. Quiet at first, unmistakable by evening.",
    story:
      "Composed around a single idea: a fragrance that is noticed only when you leave the room. The oud is kept smooth and resinous rather than animalic, wrapped in amber so it stays close to the skin for hours.",
    sizes: [
      { id: "50", label: "50 ml", ml: 50, price: 21500 },
      { id: "100", label: "100 ml", ml: 100, price: 32500 },
    ],
    defaultSizeId: "100",
    notes: [
      {
        id: "bergamot",
        name: "Bergamot",
        tier: "top",
        description: "Bitter-bright citrus peel. The first breath of cold air.",
      },
      {
        id: "cedarwood",
        name: "Cedarwood",
        tier: "heart",
        description: "Dry, pencil-shaving wood that gives the scent its spine.",
      },
      {
        id: "oud",
        name: "Oud",
        tier: "base",
        description: "Dark resinous wood — smoky, rounded, endlessly deep.",
      },
      {
        id: "amber",
        name: "Amber",
        tier: "base",
        description: "Warm, glowing resin that holds the composition together.",
      },
      {
        id: "vanilla",
        name: "Vanilla",
        tier: "base",
        description: "Dark cured vanilla — more smoke than sugar.",
      },
    ],
    bestseller: true,
  },
  {
    id: "amber",
    slug: "noire-amber",
    name: "NOIRÉ Amber",
    shortName: "AMBER",
    concentration: "Eau de Parfum",
    family: "Amber Oriental",
    tagline: "Golden hour, held in glass.",
    description:
      "Sparkling mandarin melts into labdanum and benzoin, finishing on soft vanilla and tonka. Radiant, warm and generous without ever turning sweet.",
    story:
      "A study of warmth. Resins were chosen for glow rather than weight, so the fragrance feels like late sun on skin — luminous in the day, enveloping at night.",
    sizes: [
      { id: "50", label: "50 ml", ml: 50, price: 18500 },
      { id: "100", label: "100 ml", ml: 100, price: 28500 },
    ],
    defaultSizeId: "100",
    notes: [
      {
        id: "mandarin",
        name: "Mandarin",
        tier: "top",
        description: "Juicy, sunlit citrus with a soft bitter edge.",
      },
      {
        id: "labdanum",
        name: "Labdanum",
        tier: "heart",
        description: "Sticky golden resin with a leathery warmth.",
      },
      {
        id: "benzoin",
        name: "Benzoin",
        tier: "heart",
        description: "Balsamic and soft, like warm incense smoke.",
      },
      {
        id: "vanilla",
        name: "Vanilla",
        tier: "base",
        description: "Creamy and round, kept deliberately dry.",
      },
      {
        id: "tonka",
        name: "Tonka Bean",
        tier: "base",
        description: "Almond, hay and caramel in a single note.",
      },
    ],
    bestseller: false,
  },
  {
    id: "velvet",
    slug: "noire-velvet",
    name: "NOIRÉ Velvet",
    shortName: "VELVET",
    concentration: "Eau de Parfum",
    family: "Floral Musk",
    tagline: "Rose, after midnight.",
    description:
      "Pink pepper sparks against a heart of Damask rose and powdery iris, resting on white musk and creamy sandalwood. Soft to the touch, impossible to ignore.",
    story:
      "A rose stripped of its romance and dressed in velvet. Iris adds a cool, powdery shadow while sandalwood keeps the drydown warm and intimate.",
    sizes: [
      { id: "50", label: "50 ml", ml: 50, price: 19500 },
      { id: "100", label: "100 ml", ml: 100, price: 29500 },
    ],
    defaultSizeId: "100",
    notes: [
      {
        id: "pink-pepper",
        name: "Pink Pepper",
        tier: "top",
        description: "A bright, rosy spark — more fizz than heat.",
      },
      {
        id: "rose",
        name: "Damask Rose",
        tier: "heart",
        description: "Deep, velvety petals with a jammy darkness.",
      },
      {
        id: "iris",
        name: "Iris",
        tier: "heart",
        description: "Cool, powdery and slightly earthy.",
      },
      {
        id: "musk",
        name: "White Musk",
        tier: "base",
        description: "Clean, skin-close softness.",
      },
      {
        id: "sandalwood",
        name: "Sandalwood",
        tier: "base",
        description: "Creamy, milky wood that lingers for hours.",
      },
    ],
    bestseller: false,
  },
  {
    id: "intense",
    slug: "noire-intense",
    name: "NOIRÉ Intense",
    shortName: "INTENSE",
    concentration: "Extrait de Parfum",
    family: "Leather Woody",
    tagline: "The darkest hour.",
    description:
      "Black pepper and saffron cut through a heart of supple leather, falling into smoky vetiver and cedar. Our most concentrated composition — a little goes a long way.",
    story:
      "Built for the hours after dark. Saffron gives the leather a metallic glint while vetiver adds a smoky, earthy depth that stays on fabric long after it leaves the skin.",
    sizes: [
      { id: "50", label: "50 ml", ml: 50, price: 24000 },
      { id: "100", label: "100 ml", ml: 100, price: 36000 },
    ],
    defaultSizeId: "100",
    notes: [
      {
        id: "black-pepper",
        name: "Black Pepper",
        tier: "top",
        description: "Dry, crackling heat.",
      },
      {
        id: "saffron",
        name: "Saffron",
        tier: "top",
        description: "Metallic, honeyed and slightly bitter.",
      },
      {
        id: "leather",
        name: "Leather",
        tier: "heart",
        description: "Supple, smoky hide with a velvet finish.",
      },
      {
        id: "vetiver",
        name: "Vetiver",
        tier: "base",
        description: "Earthy roots and a curl of smoke.",
      },
      {
        id: "cedarwood",
        name: "Cedarwood",
        tier: "base",
        description: "Dry, structured wood.",
      },
    ],
    bestseller: true,
  },
];

/** The fragrance featured in the hero and the home page story. */
export const SIGNATURE_ID = "oud";

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getSize(product: Product, sizeId: string): ProductSize | undefined {
  return product.sizes.find((s) => s.id === sizeId);
}

export function getDefaultSize(product: Product): ProductSize {
  return getSize(product, product.defaultSizeId) ?? product.sizes[0];
}

export function getRelated(product: Product, count = 3): Product[] {
  return products.filter((p) => p.id !== product.id).slice(0, count);
}

export function notesByTier(product: Product): Record<NoteTier, FragranceNote[]> {
  return {
    top: product.notes.filter((n) => n.tier === "top"),
    heart: product.notes.filter((n) => n.tier === "heart"),
    base: product.notes.filter((n) => n.tier === "base"),
  };
}
