"use client";

import { useRef } from "react";
import { getProduct, notesByTier, SIGNATURE_ID, type FragranceNote } from "@/lib/products";
import { notePhoto } from "@/lib/assets";
import { applyReveals, useMotion } from "@/lib/motion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { Photo } from "@/components/ui/Photo";
import styles from "./Notes.module.css";

const product = getProduct(SIGNATURE_ID)!;
const tiers = notesByTier(product);

function NoteFigure({ note, index, className, sizes }: { note: FragranceNote; index: number; className?: string; sizes: string }) {
  const photo = notePhoto(note.id);
  return (
    <figure className={`${styles.figure} ${className ?? ""}`}>
      {photo && (
        <Photo
          photo={photo}
          sizes={sizes}
          motionLayer
          className={styles.img}
          frameProps={{ "data-reveal": "clip", "data-parallax": "8" }}
        />
      )}
      <figcaption className={styles.caption} data-reveal="fade">
        <span className="label label--soft">Fig. {String(index).padStart(2, "0")}</span>
        <h3 className={styles.name}>{note.name}</h3>
        <p className={styles.desc}>{note.description}</p>
      </figcaption>
    </figure>
  );
}

/**
 * II — the notes of the featured fragrance, exactly as defined in the
 * catalogue, told as three acts. Ingredient photographs come from the asset
 * registry; a note without one would simply render as text.
 */
export function Notes() {
  const root = useRef<HTMLElement>(null);
  useMotion(root, (api) => applyReveals(root.current!, api));

  let fig = 0;
  const [top] = tiers.top;
  const [heart] = tiers.heart;

  return (
    <section ref={root} id="notes" className={`theme-espresso ${styles.section}`} aria-labelledby="notes-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="label label--rule" data-reveal="fade">
            II — The Notes
          </p>
          <h2 id="notes-title" className="display" data-reveal="lines">
            <MaskedLines lines={["Composed in", <em key="t">three acts.</em>]} />
          </h2>
          <p className={`lede ${styles.lede}`} data-reveal="fade">
            Bright at the open, structured at the heart, and deep where it settles — {product.name} unfolds slowly
            over the course of a day.
          </p>
        </header>

        {/* Act I — top */}
        <article className={`${styles.act} ${styles.actTop}`} aria-labelledby="act-top">
          <p className={styles.actLabel} data-reveal="fade">
            <span className="label">Act I</span>
            <span id="act-top" className={styles.actName}>
              The opening
            </span>
            <span className="label label--soft">Top note</span>
          </p>
          {tiers.top.map((n) => (
            <NoteFigure key={n.id} note={n} index={++fig} className={styles.wide} sizes="(min-width: 900px) 58vw, 100vw" />
          ))}
        </article>

        {/* Act II — heart */}
        <article className={`${styles.act} ${styles.actHeart}`} aria-labelledby="act-heart">
          <p className={styles.actLabel} data-reveal="fade">
            <span className="label">Act II</span>
            <span id="act-heart" className={styles.actName}>
              The spine
            </span>
            <span className="label label--soft">Heart note</span>
          </p>
          {tiers.heart.map((n) => (
            <NoteFigure key={n.id} note={n} index={++fig} className={styles.tall} sizes="(min-width: 900px) 34vw, 80vw" />
          ))}
          <p className={styles.pull} data-reveal="lines">
            <MaskedLines lines={[`From ${top.name.toLowerCase()}`, <em key="h">to {heart.name.toLowerCase()},</em>, "light to wood."]} />
          </p>
        </article>

        {/* Act III — base */}
        <article className={`${styles.act} ${styles.actBase}`} aria-labelledby="act-base">
          <p className={styles.actLabel} data-reveal="fade">
            <span className="label">Act III</span>
            <span id="act-base" className={styles.actName}>
              Where it settles
            </span>
            <span className="label label--soft">Base notes</span>
          </p>
          <div className={styles.baseRow}>
            {tiers.base.map((n, i) => (
              <NoteFigure
                key={n.id}
                note={n}
                index={++fig}
                className={styles[`base${i}`]}
                sizes="(min-width: 900px) 30vw, 70vw"
              />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
