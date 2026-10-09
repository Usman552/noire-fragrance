import Link from "next/link";
import { products } from "@/lib/products";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`theme-dark ${styles.footer}`}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.intro}>
          <p className={styles.motto}>
            Composed to be noticed <em>only when you leave the room.</em>
          </p>
        </div>
        <nav aria-label="Fragrances" className={styles.col}>
          <p className="label label--soft">Fragrances</p>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/fragrances/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="House" className={styles.col}>
          <p className="label label--soft">House</p>
          <ul>
            <li>
              <Link href="/#collection">Collection</Link>
            </li>
            <li>
              <Link href="/#notes">The notes</Link>
            </li>
            <li>
              <Link href="/#story">Our approach</Link>
            </li>
            <li>
              <Link href="/checkout">Checkout</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.col}>
          <p className="label label--soft">About this site</p>
          <p className={styles.note}>
            NOIRÉ is a fictional brand made for a design prototype. Bottles shown are unbranded stock photographs
            standing in for its products. Checkout is a demonstration: no payment is taken and no order is sent.
          </p>
          <Link href="/credits" className={styles.credits}>
            Photography credits
          </Link>
        </div>
      </div>

      <div className={`wrap ${styles.base}`}>
        <p className={styles.wordmark} aria-hidden="true">
          NOIRÉ
        </p>
        <div className={styles.meta}>
          <p>© {new Date().getFullYear()} NOIRÉ — Prototype</p>
          <p>Prices in PKR</p>
        </div>
      </div>
    </footer>
  );
}
