"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile URL-bar show/hide should not re-calculate every trigger.
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: "power3.out", duration: 1 });
    registered = true;
    // Tells the pre-paint bootstrap in app/layout.tsx that motion code is live.
    (window as unknown as { __noireMotion?: boolean }).__noireMotion = true;
  }
  return { gsap, ScrollTrigger };
}

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Shared media conditions so every section speaks the same motion language. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
} as const;

/**
 * Plays a reveal the first time it enters and never reverses it. Used instead
 * of `once: true`, which kills the trigger during ScrollTrigger's own refresh
 * loop when the page loads already scrolled past it (e.g. /#collection) and
 * makes GSAP throw.
 */
export const PLAY_ONCE = "play none none none";

export const EASE = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
  soft: "sine.inOut",
} as const;

interface MotionApi {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  mm: gsap.MatchMedia;
}

/**
 * Runs GSAP set-up scoped to an element and reverts everything (tweens,
 * ScrollTriggers, inline styles) on unmount or when deps change. Using
 * matchMedia means animations rebuild correctly on resize and when the user
 * toggles reduced motion.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, build: (api: MotionApi) => void, deps: DependencyList = []) {
  useIsoLayoutEffect(() => {
    const { gsap: g, ScrollTrigger: st } = ensureGsap();
    const mm = g.matchMedia(scope.current ?? undefined);
    try {
      build({ gsap: g, ScrollTrigger: st, mm });
    } catch (err) {
      // Motion is decoration: if it fails, fall back to static, fully visible content.
      mm.revert();
      document.documentElement.classList.remove("motion-ok");
      console.warn("[motion] animation set-up failed; showing static content", err);
    }
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Standard reveal vocabulary, applied by data attributes:
 *  [data-reveal="lines"]  – masked headline lines rise into place
 *  [data-reveal="fade"]   – soft rise + fade
 *  [data-reveal="clip"]   – image uncovers bottom-to-top (clip-path) while the
 *                           photograph inside settles from a slight scale
 *  [data-reveal="stagger"]– direct children rise in sequence
 *  [data-parallax="n"]    – the photograph drifts inside its frame (n = percent)
 */
export function applyReveals(root: HTMLElement, api: MotionApi) {
  const { gsap: g, mm } = api;
  mm.add(MQ.motion, () => {
    const q = g.utils.selector(root);
    // Pending text reveals, so keyboard focus can complete them instantly.
    const pending = new Map<Element, gsap.core.Animation>();

    q('[data-reveal="lines"]').forEach((el) => {
      pending.set(
        el,
        g.from(el.querySelectorAll("[data-line] > span"), {
          yPercent: 110,
          duration: 1.25,
          ease: EASE.expo,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: PLAY_ONCE },
        }),
      );
    });

    // Opacity only (never visibility): content stays focusable and in the
    // accessibility tree before it has been revealed.
    q('[data-reveal="fade"]').forEach((el) => {
      pending.set(
        el,
        g.from(el, {
          opacity: 0,
          y: 28,
          duration: 1.1,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: PLAY_ONCE },
        }),
      );
    });

    q('[data-reveal="stagger"]').forEach((el) => {
      pending.set(
        el,
        g.from(el.children, {
          opacity: 0,
          y: 24,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: PLAY_ONCE },
        }),
      );
    });

    const onFocus = (e: FocusEvent) => {
      for (const [el, anim] of pending) if (el.contains(e.target as Node)) anim.progress(1);
    };
    root.addEventListener("focusin", onFocus);

    q('[data-reveal="clip"]').forEach((el) => {
      const tl = g.timeline({ scrollTrigger: { trigger: el, start: "top 85%", toggleActions: PLAY_ONCE } });
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
      );
      const layer = el.querySelector("[data-photo-layer]");
      if (layer) tl.fromTo(layer, { scale: 1.18 }, { scale: 1, duration: 2, ease: EASE.expo }, 0.1);
    });

    // Moves the photograph inside its frame (the frame itself stays put).
    q("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.getAttribute("data-parallax") || "8");
      const target = el.querySelector("[data-photo-layer]") ?? el;
      g.fromTo(
        target,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    return () => root.removeEventListener("focusin", onFocus);
  });
}
