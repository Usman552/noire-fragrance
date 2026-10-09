import type { Metadata } from "next";
import { photos } from "@/lib/assets";
import { Photo } from "@/components/ui/Photo";
import styles from "./credits.module.css";

export const metadata: Metadata = {
  title: "Photography credits",
};

export default function CreditsPage() {
  const list = Object.values(photos);
  return (
    <div className={`theme-light ${styles.page}`}>
      <div className="wrap">
        <header className={styles.head}>
          <p className="label label--rule">Credits</p>
          <h1 className="display">
            Photography, <em>with thanks.</em>
          </h1>
          <p className="lede">
            NOIRÉ is a fictional brand. Every photograph on this site comes from Unsplash and is used under the{" "}
            <a href="https://unsplash.com/license" className={styles.inline}>
              Unsplash License
            </a>
            , which allows commercial use without attribution — we credit the photographers anyway. The bottles shown
            are unbranded stock photographs standing in for NOIRÉ’s products; they are not products of any of the
            photographers or of a real fragrance house.
          </p>
        </header>

        <ul className={styles.grid}>
          {list.map((p) => (
            <li key={p.credit.source} className={styles.item}>
              <Photo photo={p} sizes="(min-width: 900px) 16vw, 45vw" className={styles.thumb} />
              <p className={styles.alt}>{p.alt}</p>
              <p className={styles.by}>
                <a href={p.credit.source}>Photo</a> by <a href={p.credit.profile}>{p.credit.name}</a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
