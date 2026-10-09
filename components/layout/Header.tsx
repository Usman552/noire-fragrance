"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/CartProvider";
import styles from "./Header.module.css";

type Tone = "dark" | "light";

const THEMES: Record<string, Tone> = {
  "theme-dark": "dark",
  "theme-espresso": "dark",
  "theme-light": "light",
  "theme-stone": "light",
};

/** Reads the environment (theme-*) of whatever sits under the header bar. */
function toneAt(y: number, header: HTMLElement | null): Tone {
  const stack = document.elementsFromPoint(window.innerWidth / 2, y);
  for (const el of stack) {
    if (header?.contains(el)) continue;
    const themed = (el as HTMLElement).closest<HTMLElement>(".theme-dark, .theme-light, .theme-espresso, .theme-stone");
    if (themed) {
      for (const cls of Object.keys(THEMES)) if (themed.classList.contains(cls)) return THEMES[cls];
    }
  }
  return "dark";
}

const NAV = [
  { href: "/#collection", label: "Collection" },
  { href: "/#notes", label: "Notes" },
  { href: "/#story", label: "Story" },
];

export function Header() {
  const { totals, ready, open } = useCart();
  const ref = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<Tone>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
      const h = ref.current?.offsetHeight ?? 72;
      setTone(toneAt(h / 2, ref.current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // Re-check once late content (fonts, images) has settled.
    const t = window.setTimeout(update, 400);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(t);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const count = ready ? totals.count : 0;
  // Inner pages split light and photography side by side, so they get a solid ivory bar.
  const home = pathname === "/";

  return (
    <header
      ref={ref}
      className={styles.header}
      data-tone={menuOpen || !home ? "light" : tone}
      data-scrolled={(scrolled || !home) && !menuOpen ? "true" : "false"}
    >
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} aria-label="NOIRÉ — home">
          NOIRÉ
        </Link>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={styles.navLink}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <button
            type="button"
            className={styles.bag}
            onClick={open}
            aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
            aria-haspopup="dialog"
          >
            Bag
            <span className={styles.count} aria-hidden="true">
              {count}
            </span>
          </button>
        </div>
      </div>

      <div id="site-menu" className={styles.menu} data-open={menuOpen ? "true" : "false"} inert={!menuOpen}>
        <nav aria-label="Mobile">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={n.href} onClick={() => setMenuOpen(false)}>
                  <span className={styles.menuIndex}>0{i + 1}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.menuNote}>A fictional house of fragrance — prototype store.</p>
      </div>
    </header>
  );
}
