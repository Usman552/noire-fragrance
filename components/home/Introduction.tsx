"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDefaultSize, getProduct, notesByTier, SIGNATURE_ID } from "@/lib/products";
import { photos } from "@/lib/assets";
import { formatPrice } from "@/lib/format";
import { applyReveals, useMotion } from "@/lib/motion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { Photo } from "@/components/ui/Photo";
import { AddToBagButton } from "@/components/product/AddToBagButton";
import styles from "./Introduction.module.css";

const product = getProduct(SIGNATURE_ID)!;
const size = getDefaultSize(product);
const tiers = notesByTier(product);

/** I — the featured fragrance, introduced by its shadow rather than its bottle. */
export function Introduction() {
  const root = useRef<HTMLElement>(null);
  useMotion(root, (api) => applyReveals(root.current!, api));

  return (
    <section ref={root} id="the-fragrance" className={`theme-light ${styles.section}`} aria-labelledby="intro-title">
      <div className={`wrap ${styles.grid}`}>
        <figure className={styles.plate}>
          <Photo
            photo={photos.travertineShadow}
            sizes="(min-width: 900px) 50vw, 100vw"
            motionLayer
            className={styles.plateImg}
            frameProps={{ "data-reveal": "clip", "data-parallax": "10" }}
          />
          <figcaption className={`label label--soft ${styles.caption}`}>
            Plate 02 — Travertine, late afternoon
          </figcaption>
        </figure>

        <div className={styles.copy}>
          <p className="label label--rule" data-reveal="fade">
            I — The Fragrance
          </p>
          <h2 id="intro-title" className={`display ${styles.title}`} data-reveal="lines">
            <MaskedLines lines={["The scent", "of a", <em key="s">shadow.</em>]} />
          </h2>
          <p className={styles.body} data-reveal="fade">
            {product.description}
          </p>

          <dl className={styles.specs} data-reveal="stagger">
            <div>
              <dt className="label label--soft">Family</dt>
              <dd>{product.family}</dd>
            </div>
            <div>
              <dt className="label label--soft">Concentration</dt>
              <dd>{product.concentration}</dd>
            </div>
            <div>
              <dt className="label label--soft">Opens · Settles</dt>
              <dd>
                {tiers.top.map((n) => n.name).join(", ")} · {tiers.base.map((n) => n.name).join(", ")}
              </dd>
            </div>
          </dl>

          <div className={styles.buy} data-reveal="fade">
            <p className={styles.price}>
              <span className="sr-only">Price: </span>
              {formatPrice(size.price)}
              <span className="label label--soft">{size.label}</span>
            </p>
            <div className={styles.actions}>
              <AddToBagButton
                productId={product.id}
                sizeId={size.id}
                context={`${product.name}, ${size.label}`}
                openDrawer
              />
              <Link href={`/fragrances/${product.slug}`} className="link">
                Details <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <blockquote className={styles.quote} data-reveal="lines">
          <MaskedLines lines={["Quiet at first,", <em key="e">unmistakable</em>, <em key="b">by evening.</em>]} />
        </blockquote>

        <figure className={styles.skin}>
          <Photo
            photo={photos.skinCollarbone}
            sizes="(min-width: 900px) 24vw, 60vw"
            motionLayer
            frameProps={{ "data-reveal": "clip", "data-parallax": "8" }}
            className={styles.skinImg}
          />
          <figcaption className={styles.skinCaption} data-reveal="fade">
            <span className="label">Worn close</span>
            On skin the oud turns smoother and warmer within the hour.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
