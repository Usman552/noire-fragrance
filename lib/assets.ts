/**
 * Photography registry.
 *
 * Every image on the site is referenced through this module, so a photograph
 * can be swapped (or a real product shoot dropped in) without touching any
 * component. Files live in /public/images and are imported statically, which
 * gives next/image their intrinsic size (no layout shift) and a blur
 * placeholder for free.
 *
 * All photographs are from Unsplash and used under the Unsplash License
 * (https://unsplash.com/license): free for commercial use, attribution not
 * required. Credits are listed anyway on /credits. The bottles are unbranded
 * stock photographs that stand in for NOIRÉ's fictional products — this is a
 * prototype, and the alt text and credits page say so.
 */
import type { StaticImageData } from "next/image";

import productOud from "@/public/images/product-oud.jpg";
import productAmber from "@/public/images/product-amber.jpg";
import productVelvet from "@/public/images/product-velvet.jpg";
import productIntense from "@/public/images/product-intense.jpg";
import noteBergamot from "@/public/images/note-bergamot.jpg";
import noteCedarwood from "@/public/images/note-cedarwood.jpg";
import noteOud from "@/public/images/note-oud.jpg";
import noteAmber from "@/public/images/note-amber.jpg";
import noteVanilla from "@/public/images/note-vanilla.jpg";
import travertineShadow from "@/public/images/travertine-shadow.jpg";
import skinCollarbone from "@/public/images/skin-collarbone.jpg";
import portraitRimlight from "@/public/images/portrait-rimlight.jpg";
import neckShadow from "@/public/images/neck-shadow.jpg";
import pavilionNight from "@/public/images/pavilion-night.jpg";
import slattedLight from "@/public/images/slatted-light.jpg";
import columnLight from "@/public/images/column-light.jpg";
import pipette from "@/public/images/pipette.jpg";
import portraitStripes from "@/public/images/portrait-stripes.jpg";
import travertineGold from "@/public/images/travertine-gold.jpg";
import oudSmoke from "@/public/images/oud-smoke.jpg";
import smokeWisp from "@/public/images/smoke-wisp.jpg";

export interface Photo {
  src: StaticImageData;
  alt: string;
  /** CSS object-position used when the frame crops the photograph. */
  focus?: string;
  /** Optional different focal point for narrow (portrait) frames. */
  focusMobile?: string;
  credit: { name: string; profile: string; source: string };
}

const unsplash = (name: string, user: string, id: string) => ({
  name,
  profile: `https://unsplash.com/@${user}`,
  source: `https://unsplash.com/photos/${id}`,
});

export const photos = {
  productOud: {
    src: productOud,
    alt: "A clear rectangular flacon of amber-coloured fragrance with a black cap on a mirrored tray, leaf shadows behind it.",
    focus: "58% 74%",
    focusMobile: "60% 70%",
    credit: unsplash("Masoud Nikookalam", "msdnikoo", "bgM0Pj1DK64"),
  },
  productAmber: {
    src: productAmber,
    alt: "A square glass flacon of golden fragrance with a black cap, reflected on a white surface.",
    focus: "50% 45%",
    credit: unsplash("Akhilesh Sharma", "fotonium", "vf6DtLlwjTk"),
  },
  productVelvet: {
    src: productVelvet,
    alt: "A slim glass flacon of deep red fragrance with a black cap, backlit against a glowing coral wall.",
    focus: "50% 50%",
    credit: unsplash("Rae Wallis", "raewallis", "6uNdAlvwf98"),
  },
  productIntense: {
    src: productIntense,
    alt: "A smoked-brown glass flacon with a round stopper, standing on dark wood in near darkness.",
    // The bottle fills the frame's height; in squarer crops keep the stopper rather than the base.
    focus: "50% 28%",
    credit: unsplash("Sixteen Miles Out", "sixteenmilesout", "3R6NdOhAMP8"),
  },

  noteBergamot: {
    src: noteBergamot,
    alt: "A basket of pale, knobbly bergamot fruit with their leaves.",
    focus: "50% 50%",
    credit: unsplash("Sarah Elizabeth", "sarah_elizabeth", "1ZHOvZAoIDs"),
  },
  noteCedarwood: {
    src: noteCedarwood,
    alt: "Close-up of fibrous, reddish cedar bark.",
    focus: "50% 40%",
    credit: unsplash("Simon Ray", "simonbhray", "aVuKjgwyY14"),
  },
  noteOud: {
    src: noteOud,
    alt: "Macro of dark, resin-streaked agarwood chips — the source of oud.",
    focus: "45% 45%",
    credit: unsplash("Andy Luo", "andy8647", "36XuHd01c18"),
  },
  noteAmber: {
    src: noteAmber,
    alt: "Translucent golden amber resin, lit from within, against black.",
    focus: "60% 60%",
    credit: unsplash("Safwan Thottoli", "safwan_thottoli", "u37SOLQkxfw"),
  },
  noteVanilla: {
    src: noteVanilla,
    alt: "Two cured vanilla pods crossed on a warm cream background.",
    focus: "50% 50%",
    credit: unsplash("Jocelyn Morales", "molnj", "TYA9f8hYEX4"),
  },

  travertineShadow: {
    src: travertineShadow,
    alt: "The shadow of a perfume bottle falling across a travertine wall, light pooling through the glass.",
    focus: "50% 42%",
    credit: unsplash("mae black", "maeblack", "RUPxcOsyQI4"),
  },
  skinCollarbone: {
    src: skinCollarbone,
    alt: "Late sun and shadow across a collarbone and the base of a neck.",
    focus: "50% 40%",
    credit: unsplash("photoloord Anu", "photoloord", "CywW4f6KRXw"),
  },
  portraitRimlight: {
    src: portraitRimlight,
    alt: "A woman in profile against black, only the edge of her face and her copper hair catching the light.",
    focus: "38% 32%",
    focusMobile: "42% 35%",
    credit: unsplash("Christian Holzinger", "pixelatelier", "kEXMAGTivXA"),
  },
  neckShadow: {
    src: neckShadow,
    alt: "The shadow of a fern falling down the back of a woman's neck.",
    focus: "50% 55%",
    credit: unsplash("Klara Kulikova", "kkalerry", "VGf2ZCYf0Kk"),
  },
  pavilionNight: {
    src: pavilionNight,
    alt: "A travertine pavilion at night, a single warm light glowing beneath a low roof.",
    focus: "70% 60%",
    credit: unsplash("Davit Margaryan", "davitmarg", "4dbuCorapvg"),
  },
  slattedLight: {
    src: slattedLight,
    alt: "Late light cutting through tall slats, laying stripes across an empty table and two chairs.",
    focus: "60% 60%",
    focusMobile: "62% 70%",
    credit: unsplash("Enxh Shehi", "enxhs", "aqihVigrtHs"),
  },
  columnLight: {
    src: columnLight,
    alt: "Black-and-white photograph of a stone column base, a shaft of light falling across it.",
    focus: "50% 55%",
    credit: unsplash("Content Pixie", "contentpixie", "S0AEdTOGuVI"),
  },
  pipette: {
    src: pipette,
    alt: "A glass pipette drawing fragrance from a square glass bottle.",
    focus: "50% 50%",
    credit: unsplash("Fulvio Ciccolo", "scentspiracy", "KPmV57JHez0"),
  },
  portraitStripes: {
    src: portraitStripes,
    alt: "Black-and-white portrait of a woman crossed by bands of light from a blind.",
    focus: "50% 30%",
    credit: unsplash("Reza gholami", "rezagholamil", "0KmimFZesGM"),
  },
  travertineGold: {
    src: travertineGold,
    alt: "Cream travertine stone, warm window shadows sliding across it.",
    focus: "50% 50%",
    credit: unsplash("Barney Goodman", "bgoodpic", "oZhvfoMAD30"),
  },
  oudSmoke: {
    src: oudSmoke,
    alt: "Smoke rising from oud chips smouldering in a metal burner.",
    focus: "50% 45%",
    credit: unsplash("Anup Ghag", "anupghag", "Pnwc4DPZiUk"),
  },
  smokeWisp: {
    src: smokeWisp,
    alt: "A single thread of smoke curling upward against black.",
    focus: "50% 40%",
    credit: unsplash("Damon Lam", "dayday95", "7kEjmlDSGSU"),
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Bottle photograph for each product (fictional products, stock photographs). */
const PRODUCT_PHOTO: Record<string, PhotoKey> = {
  oud: "productOud",
  amber: "productAmber",
  velvet: "productVelvet",
  intense: "productIntense",
};

/** An atmosphere image per product, used on its detail page. */
const PRODUCT_MOOD: Record<string, PhotoKey> = {
  oud: "oudSmoke",
  amber: "travertineGold",
  velvet: "neckShadow",
  intense: "portraitStripes",
};

/** Ingredient photographs. Notes without one are presented typographically. */
const NOTE_PHOTO: Record<string, PhotoKey> = {
  bergamot: "noteBergamot",
  cedarwood: "noteCedarwood",
  oud: "noteOud",
  amber: "noteAmber",
  vanilla: "noteVanilla",
};

export function productPhoto(productId: string): Photo {
  return photos[PRODUCT_PHOTO[productId] ?? "productOud"];
}

export function productMood(productId: string): Photo | undefined {
  const key = PRODUCT_MOOD[productId];
  return key ? photos[key] : undefined;
}

export function notePhoto(noteId: string): Photo | undefined {
  const key = NOTE_PHOTO[noteId];
  return key ? photos[key] : undefined;
}
