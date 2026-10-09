"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { readReceipt, type OrderReceipt } from "@/lib/orders/orderService";
import { formatPrice } from "@/lib/format";
import styles from "./Checkout.module.css";

export function ConfirmationView() {
  const [receipt, setReceipt] = useState<OrderReceipt | null | undefined>(undefined);

  useEffect(() => {
    setReceipt(readReceipt());
  }, []);

  if (receipt === undefined) {
    return (
      <div className={`theme-light ${styles.loading}`} aria-busy="true">
        Loading…
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="theme-light">
        <div className={`wrap ${styles.empty}`}>
          <p className="label label--rule">Order confirmation</p>
          <h1 className="display">
            Nothing to <em>confirm.</em>
          </h1>
          <p className="lede">We couldn’t find a recent demo order in this browser session.</p>
          <Link href="/#collection" className="btn">
            Explore the collection
          </Link>
        </div>
      </div>
    );
  }

  const placed = new Date(receipt.createdAt);

  return (
    <div className="theme-light">
    <div className={`wrap ${styles.confirm}`}>
      <div className={styles.confirmMark} aria-hidden="true">
        <Check />
      </div>
      <p className="label label--rule">Demo order recorded</p>
      <h1 className="display">
        Thank you, <em>{receipt.customer.name.split(" ")[0]}.</em>
      </h1>
      <div className={styles.demoBanner} role="note">
        <p>
          <strong>This was a demonstration.</strong> No payment was taken and this order has not been sent to any
          business. Nothing will be delivered. Your details stay in this browser tab only.
        </p>
      </div>

      <dl className={styles.confirmMeta}>
        <div>
          <dt>Reference</dt>
          <dd>{receipt.reference}</dd>
        </div>
        <div>
          <dt>Placed</dt>
          <dd>
            {placed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })},{" "}
            {placed.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </dd>
        </div>
        <div>
          <dt>Deliver to</dt>
          <dd>
            {receipt.customer.address}, {receipt.customer.city}
          </dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>{receipt.customer.phone}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>Cash on delivery (demo)</dd>
        </div>
      </dl>

      <div className={styles.confirmItems}>
        <h2 className={styles.summaryTitle}>Items</h2>
        <ul>
          {receipt.lines.map((l) => (
            <li key={`${l.productId}-${l.sizeLabel}`}>
              <span>
                {l.quantity} × {l.name} <small>{l.sizeLabel}</small>
              </span>
              <span>{formatPrice(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(receipt.subtotal)}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>{receipt.delivery === 0 ? "Complimentary" : formatPrice(receipt.delivery)}</dd>
          </div>
          <div className={styles.grand}>
            <dt>Total</dt>
            <dd>{formatPrice(receipt.total)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.confirmActions}>
        <Link href="/#collection" className="btn">
          Continue exploring
        </Link>
        <Link href="/" className="btn btn--line">
          Back to home
        </Link>
      </div>
    </div>
    </div>
  );
}
