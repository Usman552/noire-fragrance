"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { getDefaultSize, getProduct, SIGNATURE_ID } from "@/lib/products";
import { photos } from "@/lib/assets";
import { formatPrice } from "@/lib/format";
import { EASE, MQ, useMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import styles from "./Hero.module.css";

const product = getProduct(SIGNATURE_ID)!;
const size = getDefaultSize(product);

const LINES = [
  { text: "Leave a", cls: "" },
  { text: "lasting", cls: styles.indent },
  { text: <em>impression.</em>, cls: "" },
];

/**
 * Campaign opening. The composition (photograph bleeding off the right edge,
 * headline crossing into it) works fully before any animation runs; motion
 * only reveals it.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ gsap, mm }) => {
    const q = gsap.utils.selector(root.current);
    mm.add(MQ.motion, () => {
      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .to(q("[data-hero-media]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0)
        .fromTo(q("[data-photo-layer]"), { scale: 1.16 }, { scale: 1, duration: 2.2 }, 0)
        // fromTo with explicit y: GSAP would otherwise read the CSS pre-paint offset as pixels.
        .fromTo(q("[data-hero-line] > span"), { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.09 }, 0.45)
        .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.8);

      // Leaving the hero: the photograph drifts slower than the page.
      gsap.to(q("[data-hero-drift]"), {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
  });

  return (
    <section ref={root} className={`theme-dark ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.media} data-hero-media>
        <div className={styles.drift} data-hero-drift>
          <Photo photo={photos.productOud} preload motionLayer sizes="(min-width: 900px) 56vw, 100vw" className={styles.photo} />
        </div>
        <div className={styles.shade} aria-hidden="true" />
        <p className={styles.plate} data-hero-fade>
          <span>Plate 01</span>
          <span>
            {product.name} · {size.label}
          </span>
        </p>
      </div>

      <div className={styles.copy}>
        <p className="label label--rule" data-hero-fade>
          N°01 — {product.concentration}
        </p>
        <p className={styles.lede} data-hero-fade>
          {product.tagline} A fragrance that speaks before you do — and stays a moment after you leave.
        </p>
        <div className={styles.ctas} data-hero-fade>
          <a href="#the-fragrance" className="btn">
            Discover {product.shortName.charAt(0) + product.shortName.slice(1).toLowerCase()}
            <ArrowRight data-arrow aria-hidden="true" />
          </a>
          <a href="#collection" className="link">
            The collection
          </a>
        </div>
        <p className={styles.price} data-hero-fade>
          {product.family} · from {formatPrice(product.sizes[0].price)}
        </p>
      </div>

      <h1 id="hero-title" className={`mega ${styles.title}`}>
        {LINES.map((l, i) => (
          <span key={i} className={`mask-line ${l.cls}`} data-hero-line>
            <span>{l.text}</span>
          </span>
        ))}
      </h1>
    </section>
  );
}
