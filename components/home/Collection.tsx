"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products, getDefaultSize, type Product } from "@/lib/products";
import { productPhoto } from "@/lib/assets";
import { formatPrice } from "@/lib/format";
import { applyReveals, ensureGsap, useMotion } from "@/lib/motion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { Photo } from "@/components/ui/Photo";
import { AddToBagButton } from "@/components/product/AddToBagButton";
import styles from "./Collection.module.css";

export const COLLECTION_FILTER_EVENT = "noire:collection-filter";
type Filter = "all" | "bestsellers";

/** Lets other sections (e.g. the closing scene) switch the collection filter. */
export function requestCollectionFilter(filter: Filter) {
  window.dispatchEvent(new CustomEvent<Filter>(COLLECTION_FILTER_EVENT, { detail: filter }));
}

/** Each fragrance gets its own composition rather than a shared card. */
const LAYOUT: Record<string, { cls: string; sizes: string }> = {
  oud: { cls: styles.oud, sizes: "(min-width: 900px) 52vw, 100vw" },
  amber: { cls: styles.amber, sizes: "(min-width: 900px) 30vw, 80vw" },
  velvet: { cls: styles.velvet, sizes: "(min-width: 900px) 40vw, 100vw" },
  intense: { cls: styles.intense, sizes: "(min-width: 900px) 36vw, 84vw" },
};

function CollectionItem({ product, index }: { product: Product; index: number }) {
  const size = getDefaultSize(product);
  const href = `/fragrances/${product.slug}`;
  const layout = LAYOUT[product.id] ?? LAYOUT.oud;
  return (
    <article className={`${styles.item} ${layout.cls}`} aria-labelledby={`p-${product.id}`}>
      <Link href={href} className={styles.media} tabIndex={-1} aria-hidden="true">
        <Photo
          photo={productPhoto(product.id)}
          sizes={layout.sizes}
          alt=""
          motionLayer
          className={styles.photo}
          frameProps={{ "data-reveal": "clip" }}
        />
      </Link>

      <div className={styles.info} data-reveal="fade">
        <p className="label label--soft">
          <span className={styles.index}>N°{String(index + 1).padStart(2, "0")}</span>
          {product.family} · {product.concentration}
          {product.bestseller && <span className={styles.badge}>Bestseller</span>}
        </p>
        <h3 id={`p-${product.id}`} className={styles.name}>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.desc}>{product.description}</p>
        <p className={styles.notes}>
          <span className="sr-only">Notes: </span>
          {product.notes.map((n) => n.name).join(" · ")}
        </p>
        <div className={styles.buy}>
          <p className={styles.price}>
            {formatPrice(size.price)} <span className="label label--soft">{size.label}</span>
          </p>
          <div className={styles.actions}>
            <AddToBagButton productId={product.id} sizeId={size.id} variant="line" context={`${product.name}, ${size.label}`} />
            <Link href={href} className="link">
              Details <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Collection() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const onFilter = (e: Event) => setFilter((e as CustomEvent<Filter>).detail);
    window.addEventListener(COLLECTION_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(COLLECTION_FILTER_EVENT, onFilter);
  }, []);

  // The layout changes height when filtering — let scroll animations re-measure.
  useEffect(() => {
    const { ScrollTrigger } = ensureGsap();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter]);

  useMotion(root, (api) => applyReveals(root.current!, api), [filter]);

  const visible = filter === "all" ? products : products.filter((p) => p.bestseller);

  return (
    <section ref={root} id="collection" className={`theme-light ${styles.section}`} aria-labelledby="collection-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="label label--rule" data-reveal="fade">
            IV — The Collection
          </p>
          <h2 id="collection-title" className="display" data-reveal="lines">
            <MaskedLines lines={["Four signatures.", <em key="o">One house.</em>]} />
          </h2>
          <div className={styles.aside} data-reveal="fade">
            <p className="lede">
              Each composition has its own glass, its own colour and its own hour. Choose the one that sounds most
              like you.
            </p>
            <div className={styles.filters} role="group" aria-label="Filter the collection">
              {(["all", "bestsellers"] as const).map((f) => (
                <button key={f} type="button" className={styles.filter} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : "Bestsellers"}
                  <span>{f === "all" ? products.length : products.filter((p) => p.bestseller).length}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className={styles.grid} data-filter={filter}>
          {visible.map((p) => (
            <CollectionItem key={p.id} product={p} index={products.indexOf(p)} />
          ))}
        </div>
      </div>
    </section>
  );
}
