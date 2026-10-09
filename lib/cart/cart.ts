/**
 * Pure cart model. No React, no browser APIs — so it can be unit tested and
 * reused unchanged when the cart moves to a server.
 *
 * The cart stores only references (product + size + quantity). Prices are
 * always resolved from the catalogue at read time, so a stale localStorage
 * entry can never show an outdated price.
 */
import { getProduct, getSize, type Product, type ProductSize } from "../products.ts";

export const MAX_QTY = 10;

export interface CartLine {
  productId: string;
  sizeId: string;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
}

export type CartAction =
  | { type: "add"; productId: string; sizeId: string; quantity?: number }
  | { type: "setQuantity"; productId: string; sizeId: string; quantity: number }
  | { type: "remove"; productId: string; sizeId: string }
  | { type: "clear" }
  | { type: "replace"; state: CartState };

export const emptyCart: CartState = { lines: [] };

const clampQty = (q: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(q)));

const sameLine = (l: CartLine, productId: string, sizeId: string) =>
  l.productId === productId && l.sizeId === sizeId;

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const product = getProduct(action.productId);
      if (!product || !getSize(product, action.sizeId)) return state;
      const addQty = clampQty(action.quantity ?? 1);
      if (addQty === 0) return state;
      const existing = state.lines.find((l) => sameLine(l, action.productId, action.sizeId));
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l === existing ? { ...l, quantity: clampQty(l.quantity + addQty) } : l,
          ),
        };
      }
      return {
        lines: [...state.lines, { productId: action.productId, sizeId: action.sizeId, quantity: addQty }],
      };
    }
    case "setQuantity": {
      const q = clampQty(action.quantity);
      if (q === 0) {
        return { lines: state.lines.filter((l) => !sameLine(l, action.productId, action.sizeId)) };
      }
      return {
        lines: state.lines.map((l) =>
          sameLine(l, action.productId, action.sizeId) ? { ...l, quantity: q } : l,
        ),
      };
    }
    case "remove":
      return { lines: state.lines.filter((l) => !sameLine(l, action.productId, action.sizeId)) };
    case "clear":
      return emptyCart;
    case "replace":
      return sanitizeCart(action.state);
    default:
      return state;
  }
}

/** Drops unknown products/sizes and clamps quantities. Safe for untrusted input. */
export function sanitizeCart(input: unknown): CartState {
  if (!input || typeof input !== "object" || !Array.isArray((input as CartState).lines)) {
    return emptyCart;
  }
  const lines: CartLine[] = [];
  for (const raw of (input as CartState).lines) {
    if (!raw || typeof raw !== "object") continue;
    const { productId, sizeId, quantity } = raw as CartLine;
    if (typeof productId !== "string" || typeof sizeId !== "string") continue;
    const product = getProduct(productId);
    if (!product || !getSize(product, sizeId)) continue;
    const q = clampQty(Number(quantity));
    if (q === 0) continue;
    const dup = lines.find((l) => sameLine(l, productId, sizeId));
    if (dup) dup.quantity = clampQty(dup.quantity + q);
    else lines.push({ productId, sizeId, quantity: q });
  }
  return { lines };
}

export interface ResolvedLine extends CartLine {
  key: string;
  product: Product;
  size: ProductSize;
  unitPrice: number;
  lineTotal: number;
}

export function resolveLines(state: CartState): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const line of state.lines) {
    const product = getProduct(line.productId);
    const size = product && getSize(product, line.sizeId);
    if (!product || !size) continue;
    out.push({
      ...line,
      key: `${line.productId}:${line.sizeId}`,
      product,
      size,
      unitPrice: size.price,
      lineTotal: size.price * line.quantity,
    });
  }
  return out;
}

export function cartCount(state: CartState): number {
  return state.lines.reduce((n, l) => n + l.quantity, 0);
}

export function cartSubtotal(state: CartState): number {
  return resolveLines(state).reduce((sum, l) => sum + l.lineTotal, 0);
}

/** Demo delivery policy. Kept here so the summary and checkout always agree. */
export const FREE_DELIVERY_THRESHOLD = 25000;
export const DELIVERY_FEE = 350;

export function deliveryFee(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export interface CartTotals {
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
}

export function cartTotals(state: CartState): CartTotals {
  const subtotal = cartSubtotal(state);
  const delivery = deliveryFee(subtotal);
  return { count: cartCount(state), subtotal, delivery, total: subtotal + delivery };
}
