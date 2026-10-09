"use client";

import { useRef } from "react";
import { photos } from "@/lib/assets";
import { EASE, MQ, PLAY_ONCE, applyReveals, useMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { MaskedLines } from "@/components/ui/MaskedLines";
import styles from "./Campaign.module.css";

/**
 * III — one campaign photograph, opened like a door as it scrolls into view
 * (scrubbed, never pinned), followed by two smaller plates.
 */
export function Campaign() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (api) => {
    const { gsap, mm } = api;
    const q = gsap.utils.selector(root.current);
    mm.add({ motion: MQ.motion, narrow: "(max-width: 899px)" }, (ctx) => {
      if (!ctx.conditions?.motion) return;
      const frame = q("[data-campaign-frame]")[0];
      gsap.fromTo(
        frame,
        { clipPath: ctx.conditions.narrow ? "inset(6% 9% 6% 9%)" : "inset(10% 24% 10% 24%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top 95%", end: "top 15%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        q("[data-campaign-frame] [data-photo-layer]"),
        { scale: 1.22 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom 40%", scrub: 0.6 },
        },
      );
      gsap.from(q("[data-campaign-word] > span"), {
        yPercent: 110,
        duration: 1.4,
        ease: EASE.expo,
        stagger: 0.12,
        scrollTrigger: { trigger: frame, start: "top 30%", toggleActions: PLAY_ONCE },
      });
    });
    applyReveals(root.current!, api);
  });

  return (
    <section ref={root} className={`theme-dark ${styles.section}`} aria-labelledby="campaign-title">
      <div className={styles.scene}>
        <div className={styles.frame} data-campaign-frame>
          <Photo photo={photos.portraitRimlight} sizes="100vw" motionLayer className={styles.photo} />
          <div className={styles.vignette} aria-hidden="true" />
          <p className={`label ${styles.chapter}`}>III — After Dark</p>
          <h2 id="campaign-title" className={`display ${styles.headline}`}>
            <span className={`mask-line ${styles.l1}`} data-campaign-word>
              <span>Worn close.</span>
            </span>
            <span className={`mask-line ${styles.l2}`} data-campaign-word>
              <span>
                <em>Remembered long.</em>
              </span>
            </span>
          </h2>
        </div>
      </div>

      <div className={`wrap ${styles.after}`}>
        <figure className={styles.pavilion}>
          <Photo
            photo={photos.pavilionNight}
            sizes="(min-width: 900px) 58vw, 100vw"
            motionLayer
            className={styles.pavilionImg}
            frameProps={{ "data-reveal": "clip", "data-parallax": "8" }}
          />
          <figcaption className="label label--soft">Plate 04 — The hours after</figcaption>
        </figure>

        <blockquote className={styles.quote} data-reveal="lines">
          <MaskedLines
            lines={[
              "The first spray is bright",
              "and cold. An hour later",
              <em key="a">it is something else —</em>,
              <em key="b">warmer, closer, yours.</em>,
            ]}
          />
        </blockquote>

        <figure className={styles.neck}>
          <Photo
            photo={photos.neckShadow}
            sizes="(min-width: 900px) 26vw, 64vw"
            motionLayer
            className={styles.neckImg}
            frameProps={{ "data-reveal": "clip", "data-parallax": "10" }}
          />
          <figcaption className="label label--soft">Plate 05 — Shadow, skin</figcaption>
        </figure>
      </div>
    </section>
  );
}
