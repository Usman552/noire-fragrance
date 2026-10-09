"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getDefaultSize, getSize, notesByTier, products, type Product } from "@/lib/products";
import { notePhoto, productMood, productPhoto } from "@/lib/assets";
import { formatPrice } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart/cart";
import { EASE, MQ, applyReveals, useMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { AddToBagButton } from "./AddToBagButton";
import styles from "./ProductDetail.module.css";

const TIERS = [
  ["top", "Top"],
  ["heart", "Heart"],
  ["base", "Base"],
] as const;

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [sizeId, setSizeId] = useState(product.defaultSizeId);
  const [qty, setQty] = useState(1);
  const size = getSize(product, sizeId) ?? getDefaultSize(product);
  const tiers = notesByTier(product);
  // `product` arrives serialised from the server component, so match by id, not identity.
  const number = String(products.findIndex((p) => p.id === product.id) + 1).padStart(2, "0");
  const mood = productMood(product.id);
  const ingredients = product.notes.flatMap((n) => {
    const photo = notePhoto(n.id);
    return photo ? [{ note: n, photo }] : [];
  });

  useMotion(
    root,
    (api) => {
      const { gsap, mm } = api;
      const q = gsap.utils.selector(root.current);
      // Opening: the photograph uncovers and settles, the copy follows.
      mm.add(MQ.motion, () => {
        gsap.set(q("[data-intro]"), { opacity: 1 });
        gsap
          .timeline({ defaults: { ease: EASE.expo } })
          .fromTo(q("[data-pd-media]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 0)
          .fromTo(q("[data-pd-media] [data-photo-layer]"), { scale: 1.14 }, { scale: 1, duration: 2 }, 0)
          .from(q("[data-pd-in]"), { y: 22, opacity: 0, duration: 1, stagger: 0.06 }, 0.35);
      });
      applyReveals(root.current!, api);
    },
    [product.id],
  );

  return (
    <div ref={root} className={`theme-light ${styles.page}`}>
      <div className={styles.top}>
        <div className={styles.mediaCol} data-intro>
          <div className={styles.media} data-pd-media>
            <Photo
              photo={productPhoto(product.id)}
              preload
              motionLayer
              sizes="(min-width: 900px) 55vw, 100vw"
              className={styles.photo}
            />
          </div>
        </div>

        <div className={styles.info} data-intro>
          <nav aria-label="Breadcrumb" className={styles.crumbs} data-pd-in>
            <Link href="/#collection" className={styles.back}>
              <ArrowLeft aria-hidden="true" /> Collection
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>

          <p className="label label--soft" data-pd-in>
            N°{number} · {product.family}
          </p>
          <h1 className={`display ${styles.name}`} data-pd-in>
            <span className="sr-only">NOIRÉ </span>
            {product.name.replace("NOIRÉ ", "")}
          </h1>
          <p className={styles.tagline} data-pd-in>
            {product.tagline}
          </p>
          <p className={styles.desc} data-pd-in>
            {product.description}
          </p>

          <div className={styles.purchaseBox} data-pd-in>
            <p className={styles.price} aria-live="polite">
              {formatPrice(size.price)}
              <span className="label label--soft">{size.label}</span>
            </p>

            <fieldset className={styles.sizes}>
              <legend className="label">Size</legend>
              <div className={styles.sizeOptions}>
                {product.sizes.map((s) => (
                  <label key={s.id} className={styles.sizeOption}>
                    <input type="radio" name="size" value={s.id} checked={s.id === sizeId} onChange={() => setSizeId(s.id)} />
                    <span>
                      <strong>{s.label}</strong>
                      <small>{formatPrice(s.price)}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.purchase}>
              <QuantityStepper value={qty} onChange={setQty} label={`${product.name} quantity`} />
              <AddToBagButton
                productId={product.id}
                sizeId={size.id}
                quantity={qty}
                openDrawer
                block
                context={`${qty} × ${product.name}, ${size.label}`}
              />
            </div>
            <p className={styles.service}>
              Complimentary delivery over {formatPrice(FREE_DELIVERY_THRESHOLD)}. Prototype store — no payment is taken.
            </p>
          </div>

          <section className={styles.block} aria-labelledby="pd-notes" data-pd-in>
            <h2 id="pd-notes" className="label">
              Notes
            </h2>
            <dl className={styles.pyramid}>
              {TIERS.map(([key, label]) => (
                <div key={key}>
                  <dt className="label label--soft">{label}</dt>
                  <dd>
                    {tiers[key].map((n) => (
                      <p key={n.id}>
                        <span className={styles.noteName}>{n.name}</span>
                        <span className={styles.noteDesc}>{n.description}</span>
                      </p>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.block} aria-labelledby="pd-details" data-pd-in>
            <h2 id="pd-details" className="label">
              Details
            </h2>
            <dl className={styles.details}>
              <div>
                <dt>Concentration</dt>
                <dd>{product.concentration}</dd>
              </div>
              <div>
                <dt>Family</dt>
                <dd>{product.family}</dd>
              </div>
              <div>
                <dt>Sizes</dt>
                <dd>{product.sizes.map((s) => s.label).join(" / ")}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {mood && (
        <section className={`theme-dark ${styles.mood}`} aria-label={`About ${product.name}`}>
          <Photo
            photo={mood}
            sizes="100vw"
            motionLayer
            className={styles.moodImg}
            frameProps={{ "data-parallax": "12" }}
          />
          <div className={styles.moodShade} aria-hidden="true" />
          <div className={`wrap ${styles.moodCopy}`}>
            <p className="label label--rule" data-reveal="fade">
              The composition
            </p>
            <p className={styles.story} data-reveal="fade">
              {product.story}
            </p>
          </div>
        </section>
      )}

      {ingredients.length >= 3 && (
        <section className={`wrap ${styles.ingredients}`} aria-labelledby="pd-ingredients">
          <h2 id="pd-ingredients" className="label label--rule" data-reveal="fade">
            Ingredients
          </h2>
          <ul className={styles.ingredientRow}>
            {ingredients.map(({ note, photo }) => (
              <li key={note.id}>
                <Photo
                  photo={photo}
                  sizes="(min-width: 900px) 20vw, 45vw"
                  motionLayer
                  className={styles.ingredientImg}
                  frameProps={{ "data-reveal": "clip" }}
                />
                <p className={styles.ingredientName}>{note.name}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={`wrap ${styles.related}`} aria-labelledby="related-title">
        <div className={styles.relatedHead}>
          <p className="label label--rule">Continue</p>
          <h2 id="related-title" className="h2">
            You may also <em>consider.</em>
          </h2>
        </div>
        <ul className={styles.relatedGrid}>
          {related.map((p) => (
            <li key={p.id} className={styles.relatedItem}>
              <Link href={`/fragrances/${p.slug}`} className={styles.relatedLink}>
                <Photo photo={productPhoto(p.id)} sizes="(min-width: 900px) 28vw, 80vw" alt="" className={styles.relatedImg} />
                <span className={styles.relatedInfo}>
                  <span className="label label--soft">{p.family}</span>
                  <span className={styles.relatedName}>
                    {p.name} <ArrowUpRight aria-hidden="true" />
                  </span>
                  <span className="soft">From {formatPrice(Math.min(...p.sizes.map((x) => x.price)))}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
