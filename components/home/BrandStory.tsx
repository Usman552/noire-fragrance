"use client";

import { useRef } from "react";
import { photos } from "@/lib/assets";
import { applyReveals, useMotion } from "@/lib/motion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { Photo } from "@/components/ui/Photo";
import styles from "./BrandStory.module.css";

const PRINCIPLES = [
  { n: "i.", title: "Composed slowly", text: "Each fragrance is revised until nothing can be removed without it losing its character." },
  { n: "ii.", title: "Fewer, better notes", text: "Short formulas with room for every ingredient to be heard." },
  { n: "iii.", title: "Made to be worn", text: "Built for skin and fabric — for the hours, not the first impression alone." },
];

/** V — the house's approach. A statement, two photographs, three principles. */
export function BrandStory() {
  const root = useRef<HTMLElement>(null);
  useMotion(root, (api) => applyReveals(root.current!, api));

  return (
    <section ref={root} id="story" className={`theme-stone ${styles.section}`} aria-labelledby="story-title">
      <div className={`wrap ${styles.grid}`}>
        <p className={`label label--rule ${styles.chapter}`} data-reveal="fade">
          V — The House
        </p>
        <h2 id="story-title" className={`h2 ${styles.statement}`} data-reveal="lines">
          <MaskedLines
            lines={[
              "A fragrance should not shout.",
              <>
                It should arrive <em>a moment before you</em>
              </>,
              <>
                and stay <em>a moment after you leave.</em>
              </>,
            ]}
          />
        </h2>

        <figure className={styles.column}>
          <Photo
            photo={photos.columnLight}
            sizes="(min-width: 900px) 38vw, 90vw"
            motionLayer
            className={styles.columnImg}
            frameProps={{ "data-reveal": "clip", "data-parallax": "10" }}
          />
          <figcaption className="label label--soft">Plate 06 — Light, stone, time</figcaption>
        </figure>

        <div className={styles.text}>
          <div className={styles.body} data-reveal="stagger">
            <p>
              NOIRÉ began with a simple conviction: that the most memorable fragrances are the quiet ones. We compose
              for individuality — scents that change with the skin that wears them, so no two people ever smell quite
              the same in them.
            </p>
          </div>

          <figure className={styles.pipette}>
            <Photo
              photo={photos.pipette}
              sizes="(min-width: 900px) 18vw, 50vw"
              motionLayer
              className={styles.pipetteImg}
              frameProps={{ "data-reveal": "clip" }}
            />
          </figure>

          <ol className={styles.principles} data-reveal="stagger">
            {PRINCIPLES.map((p) => (
              <li key={p.n}>
                <span className={styles.pn}>{p.n}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
