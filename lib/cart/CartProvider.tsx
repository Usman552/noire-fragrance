"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cartReducer, cartTotals, emptyCart, resolveLines, type CartTotals, type ResolvedLine } from "./cart";
import { CART_STORAGE_KEY, loadCart, saveCart } from "./storage";
import { getProduct, getSize } from "../products";

interface CartContextValue {
  lines: ResolvedLine[];
  totals: CartTotals;
  /** False until the persisted cart has been read on the client. */
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, sizeId: string, quantity?: number, opts?: { openDrawer?: boolean }) => void;
  setQuantity: (productId: string, sizeId: string, quantity: number) => void;
  remove: (productId: string, sizeId: string) => void;
  clear: () => void;
  announce: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const msgTimer = useRef<number | undefined>(undefined);

  // Hydrate from storage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    dispatch({ type: "replace", state: loadCart() });
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) dispatch({ type: "replace", state: loadCart() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ready) saveCart(state);
  }, [state, ready]);

  const announce = useCallback((m: string) => {
    window.clearTimeout(msgTimer.current);
    setMessage("");
    // Re-set on the next frame so screen readers repeat identical messages.
    requestAnimationFrame(() => setMessage(m));
    msgTimer.current = window.setTimeout(() => setMessage(""), 4000);
  }, []);

  const add = useCallback<CartContextValue["add"]>(
    (productId, sizeId, quantity = 1, opts) => {
      dispatch({ type: "add", productId, sizeId, quantity });
      const p = getProduct(productId);
      const s = p && getSize(p, sizeId);
      if (p && s) announce(`${p.name}, ${s.label}, added to your bag.`);
      if (opts?.openDrawer) setOpen(true);
    },
    [announce],
  );

  const setQuantity = useCallback((productId: string, sizeId: string, quantity: number) => {
    dispatch({ type: "setQuantity", productId, sizeId, quantity });
  }, []);

  const remove = useCallback(
    (productId: string, sizeId: string) => {
      dispatch({ type: "remove", productId, sizeId });
      const p = getProduct(productId);
      if (p) announce(`${p.name} removed from your bag.`);
    },
    [announce],
  );

  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: resolveLines(state),
      totals: cartTotals(state),
      ready,
      isOpen,
      open,
      close,
      add,
      setQuantity,
      remove,
      clear,
      announce,
    }),
    [state, ready, isOpen, open, close, add, setQuantity, remove, clear, announce],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
