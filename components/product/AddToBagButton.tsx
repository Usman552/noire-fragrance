"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/CartProvider";

interface Props {
  productId: string;
  sizeId: string;
  quantity?: number;
  variant?: "solid" | "line";
  block?: boolean;
  openDrawer?: boolean;
  label?: string;
  className?: string;
  /** Accessible context, e.g. "NOIRÉ Oud, 100 ml". */
  context: string;
}

export function AddToBagButton({
  productId,
  sizeId,
  quantity = 1,
  variant = "solid",
  block,
  openDrawer = false,
  label = "Add to bag",
  className,
  context,
}: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className={`btn ${variant === "line" ? "btn--line" : ""} ${block ? "btn--block" : ""} ${className ?? ""}`}
      aria-label={`${label}: ${context}`}
      onClick={() => {
        add(productId, sizeId, quantity, { openDrawer });
        setAdded(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      <span aria-hidden="true">{added ? "Added to bag" : label}</span>
      {added ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
    </button>
  );
}
