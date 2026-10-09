"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/cart/cart";
import styles from "./QuantityStepper.module.css";

interface Props {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export function QuantityStepper({ value, onChange, label, min = 1, max = MAX_QTY, size = "md" }: Props) {
  return (
    <div className={`${styles.stepper} ${size === "md" ? styles.md : ""}`} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={min === 0 && value === 1 ? `Remove, ${label}` : `Decrease quantity, ${label}`}
      >
        <Minus aria-hidden="true" />
      </button>
      <output className={styles.value}>
        {value}
      </output>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase quantity, ${label}`}
      >
        <Plus aria-hidden="true" />
      </button>
    </div>
  );
}
