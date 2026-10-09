import { emptyCart, sanitizeCart, type CartState } from "./cart.ts";

/**
 * localStorage persistence. Versioned so the shape can change safely later.
 * Swap this module for a server-backed implementation when a backend exists.
 */
export const CART_STORAGE_KEY = "noire.cart.v1";

export function loadCart(): CartState {
  if (typeof window === "undefined") return emptyCart;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? sanitizeCart(JSON.parse(raw)) : emptyCart;
  } catch {
    return emptyCart;
  }
}

export function saveCart(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled (private mode) — the cart still works in memory.
  }
}
