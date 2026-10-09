"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import {
  PK_CITIES,
  emptyCheckout,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutFields,
} from "@/lib/checkout/validation";
import { orderService, storeReceipt } from "@/lib/orders/orderService";
import type { CartState } from "@/lib/cart/cart";
import { Photo } from "@/components/ui/Photo";
import { productPhoto } from "@/lib/assets";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import styles from "./Checkout.module.css";

const FIELD_ORDER: (keyof CheckoutFields)[] = ["name", "phone", "email", "address", "city", "notes"];

export function CheckoutView() {
  const { lines, totals, ready, setQuantity, remove, clear } = useCart();
  const router = useRouter();
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFields, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: keyof CheckoutFields, value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    // Re-validate a field live once the user has left it.
    if (touched[key]) setErrors((e) => ({ ...e, [key]: validateCheckout(next)[key] }));
  };

  const blur = (key: keyof CheckoutFields) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateCheckout(fields)[key] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const found = validateCheckout(fields);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const firstInvalid = FIELD_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const cart: CartState = {
        lines: lines.map((l) => ({ productId: l.productId, sizeId: l.sizeId, quantity: l.quantity })),
      };
      const receipt = await orderService.submit(cart, fields);
      storeReceipt(receipt);
      setPlaced(true);
      clear();
      router.push("/checkout/confirmation");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (!ready || placed) {
    return (
      <div className={`theme-light ${styles.loading}`} aria-busy="true" aria-live="polite">
        {placed ? "Confirming your demo order…" : "Loading your bag…"}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="theme-light">
        <div className={`wrap ${styles.empty}`}>
          <p className="label label--rule">Checkout</p>
          <h1 className="display">
            Your bag is <em>empty.</em>
          </h1>
          <p className="lede">Add a fragrance to your bag to continue to checkout.</p>
          <Link href="/#collection" className="btn">
            Explore the collection
          </Link>
        </div>
      </div>
    );
  }

  const fieldProps = (key: keyof CheckoutFields) => ({
    id: `f-${key}`,
    name: key,
    value: fields[key],
    onBlur: () => blur(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
  });

  const error = (key: keyof CheckoutFields) =>
    errors[key] ? (
      <p id={`e-${key}`} className={styles.error}>
        {errors[key]}
      </p>
    ) : null;

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="theme-light">
    <div className={`wrap ${styles.layout}`}>
      <div className={styles.formCol}>
        <Link href="/#collection" className={styles.back}>
          <ArrowLeft aria-hidden="true" /> Continue shopping
        </Link>
        <h1 className={`display ${styles.title}`}>Checkout</h1>

        <div className={styles.demoBanner} role="note">
          <Info aria-hidden="true" />
          <p>
            <strong>Demonstration checkout.</strong> No payment is taken and no order is sent to any business. A real
            order service and payment provider must be connected before this store can trade.
          </p>
        </div>

        <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-describedby="form-status">
          <div id="form-status" className="sr-only" aria-live="assertive">
            {errorCount > 0 ? `${errorCount} field${errorCount > 1 ? "s need" : " needs"} attention.` : ""}
          </div>

          <fieldset className={styles.group}>
            <legend>Contact</legend>
            <div className={styles.field}>
              <label htmlFor="f-name">Full name</label>
              <input {...fieldProps("name")} autoComplete="name" required onChange={(e) => update("name", e.target.value)} />
              {error("name")}
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="f-phone">Mobile number</label>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0300 1234567"
                  required
                  onChange={(e) => update("phone", e.target.value)}
                />
                {error("phone")}
              </div>
              <div className={styles.field}>
                <label htmlFor="f-email">
                  Email <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  {...fieldProps("email")}
                  type="email"
                  autoComplete="email"
                  onChange={(e) => update("email", e.target.value)}
                />
                {error("email")}
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.group}>
            <legend>Delivery</legend>
            <div className={styles.field}>
              <label htmlFor="f-address">Address</label>
              <textarea
                {...fieldProps("address")}
                rows={3}
                autoComplete="street-address"
                placeholder="House, street, area"
                required
                onChange={(e) => update("address", e.target.value)}
              />
              {error("address")}
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="f-city">City</label>
                <select {...fieldProps("city")} required onChange={(e) => update("city", e.target.value)}>
                  <option value="">Select a city</option>
                  {PK_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {error("city")}
              </div>
              <div className={styles.field}>
                <label htmlFor="f-notes">
                  Delivery notes <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  {...fieldProps("notes")}
                  maxLength={300}
                  placeholder="Landmark, preferred time"
                  onChange={(e) => update("notes", e.target.value)}
                />
                {error("notes")}
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.group}>
            <legend>Payment</legend>
            <label className={styles.payment}>
              <input type="radio" name="payment" defaultChecked />
              <span>
                Cash on delivery
                <small>Demo only — nothing will be delivered or collected.</small>
              </span>
            </label>
          </fieldset>

          {submitError && (
            <p className={styles.submitError} role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" className="btn btn--block" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 aria-hidden="true" className={styles.spin} /> Placing demo order…
              </>
            ) : (
              <>Place demo order · {formatPrice(totals.total)}</>
            )}
          </button>
        </form>
      </div>

      <aside className={styles.summaryCol} aria-labelledby="summary-title">
        <div className={styles.summary}>
          <h2 id="summary-title" className={styles.summaryTitle}>
            Order summary <span>({totals.count})</span>
          </h2>
          <ul className={styles.items}>
            {lines.map((l) => (
              <li key={l.key} className={styles.item}>
                <div className={styles.thumb}>
                  <Photo photo={productPhoto(l.productId)} sizes="72px" alt="" className={styles.thumbImg} />
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{l.product.name}</p>
                  <p className={styles.itemMeta}>
                    {l.size.label} · {formatPrice(l.unitPrice)}
                  </p>
                  <div className={styles.itemControls}>
                    <QuantityStepper
                      size="sm"
                      min={0}
                      value={l.quantity}
                      label={`${l.product.name}, ${l.size.label}`}
                      onChange={(q) => setQuantity(l.productId, l.sizeId, q)}
                    />
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => remove(l.productId, l.sizeId)}
                      aria-label={`Remove ${l.product.name}, ${l.size.label}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className={styles.itemTotal}>{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className={styles.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{totals.delivery === 0 ? "Complimentary" : formatPrice(totals.delivery)}</dd>
            </div>
            <div className={styles.grand}>
              <dt>Total</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
    </div>
  );
}
