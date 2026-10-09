"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { useCart } from "@/lib/cart/CartProvider";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart/cart";
import { formatPrice } from "@/lib/format";
import { Photo } from "@/components/ui/Photo";
import { productPhoto } from "@/lib/assets";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import styles from "./CartDrawer.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function CartDrawer() {
  const { isOpen, close, lines, totals, setQuantity, remove } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Focus management, Escape, focus trap and scroll lock.
  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeBtn.current?.focus(), 60);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      html.style.paddingRight = "";
      returnFocus.current?.focus?.();
    };
  }, [isOpen, close]);

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal);
  const progress = Math.min(1, totals.subtotal / FREE_DELIVERY_THRESHOLD);

  return (
    <div className={styles.root} data-open={isOpen ? "true" : "false"} aria-hidden={!isOpen} inert={!isOpen}>
      <div className={styles.overlay} onClick={close} />
      <div
        ref={panel}
        className={`theme-light ${styles.panel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className={styles.head}>
          <h2 id="cart-title" className={styles.title}>
            Your bag <span>({totals.count})</span>
          </h2>
          <button ref={closeBtn} type="button" className={styles.close} onClick={close} aria-label="Close bag">
            <X aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              Your bag is <em>empty.</em>
            </p>
            <p className="soft">Every signature starts somewhere. Find yours in the collection.</p>
            <Link href="/#collection" className="btn" onClick={close}>
              Explore the collection <ArrowRight data-arrow aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.delivery}>
              <p>
                {remaining > 0
                  ? `Add ${formatPrice(remaining)} for complimentary delivery.`
                  : "Your order qualifies for complimentary delivery."}
              </p>
              <div className={styles.bar} aria-hidden="true">
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>

            <ul className={styles.lines}>
              {lines.map((line, i) => (
                <li key={line.key} className={styles.line} style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`/fragrances/${line.product.slug}`} className={styles.thumb} onClick={close} tabIndex={-1} aria-hidden="true">
                    <Photo photo={productPhoto(line.productId)} sizes="96px" alt="" className={styles.thumbImg} />
                  </Link>
                  <div className={styles.lineInfo}>
                    <div className={styles.lineTop}>
                      <div>
                        <Link href={`/fragrances/${line.product.slug}`} className={styles.lineName} onClick={close}>
                          {line.product.name}
                        </Link>
                        <p className={styles.lineMeta}>
                          {line.product.concentration} · {line.size.label}
                        </p>
                      </div>
                      <p className={styles.linePrice}>{formatPrice(line.lineTotal)}</p>
                    </div>
                    <div className={styles.lineBottom}>
                      <QuantityStepper
                        size="sm"
                        min={0}
                        value={line.quantity}
                        label={`${line.product.name}, ${line.size.label}`}
                        onChange={(q) => setQuantity(line.productId, line.sizeId, q)}
                      />
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => remove(line.productId, line.sizeId)}
                        aria-label={`Remove ${line.product.name}, ${line.size.label}`}
                      >
                        Remove
                      </button>
                    </div>
                    {line.quantity > 1 && (
                      <p className={styles.unit}>{formatPrice(line.unitPrice)} each</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <footer className={styles.foot}>
              <dl className={styles.totals}>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>{totals.delivery === 0 ? "Complimentary" : formatPrice(totals.delivery)}</dd>
                </div>
                <div className={styles.total}>
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn btn--block" onClick={close}>
                Checkout <ArrowRight data-arrow aria-hidden="true" />
              </Link>
              <button type="button" className={`link ${styles.continue}`} onClick={close}>
                Continue shopping
              </button>
              <p className={styles.demo}>Demo store — checkout does not take payment or place real orders.</p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
