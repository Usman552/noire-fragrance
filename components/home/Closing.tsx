"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { photos } from "@/lib/assets";
import { MQ, applyReveals, useMotion } from "@/lib/motion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { Photo } from "@/components/ui/Photo";
import { requestCollectionFilter } from "./Collection";
import styles from "./Closing.module.css";

/** The last frame: an empty room after someone has left it. */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (api) => {
    const { gsap, mm } = api;
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        root.current!.querySelector("[data-photo-layer]"),
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 4,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
    });
    applyReveals(root.current!, api);
  });

  return (
    <section ref={root} className={`theme-dark ${styles.section}`} aria-labelledby="closing-title">
      <Photo photo={photos.slattedLight} sizes="100vw" motionLayer className={styles.photo} />
      <div className={styles.shade} aria-hidden="true" />

      <div className={`wrap ${styles.content}`}>
        <p className="label label--rule" data-reveal="fade">
          NOIRÉ — Four fragrances
        </p>
        <h2 id="closing-title" className={`mega ${styles.title}`} data-reveal="lines">
          <MaskedLines lines={["Leave", <em key="s">something</em>, "behind."]} />
        </h2>
        <div className={styles.foot} data-reveal="fade">
          <p className={styles.copy}>Find the one that stays in the room after you have left it.</p>
          <div className={styles.ctas}>
            <a href="#collection" className="btn" onClick={() => requestCollectionFilter("all")}>
              Shop the collection <ArrowRight data-arrow aria-hidden="true" />
            </a>
            <a href="#collection" className="link" onClick={() => requestCollectionFilter("bestsellers")}>
              Bestsellers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
