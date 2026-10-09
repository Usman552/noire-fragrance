import { cartTotals, resolveLines, type CartState } from "../cart/cart.ts";
import { normalizePkPhone, type CheckoutFields } from "../checkout/validation.ts";

/**
 * Order submission boundary.
 *
 * The UI only talks to `OrderService`. Today it is backed by `demoOrderService`,
 * which never leaves the browser. To go live, implement `OrderService` against
 * a real API (and a payment provider) and swap the export at the bottom.
 */

export interface OrderLineSnapshot {
  productId: string;
  name: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderReceipt {
  reference: string;
  createdAt: string;
  customer: { name: string; phone: string; city: string; address: string; email?: string };
  lines: OrderLineSnapshot[];
  subtotal: number;
  delivery: number;
  total: number;
  /** True while no backend is connected. The UI must say so. */
  demo: boolean;
}

export interface OrderService {
  submit(cart: CartState, fields: CheckoutFields): Promise<OrderReceipt>;
}

export function buildReceipt(cart: CartState, fields: CheckoutFields, reference: string, demo: boolean): OrderReceipt {
  const totals = cartTotals(cart);
  return {
    reference,
    createdAt: new Date().toISOString(),
    customer: {
      name: fields.name.trim(),
      phone: normalizePkPhone(fields.phone) ?? fields.phone.trim(),
      city: fields.city.trim(),
      address: fields.address.trim(),
      email: fields.email.trim() || undefined,
    },
    lines: resolveLines(cart).map((l) => ({
      productId: l.productId,
      name: l.product.name,
      sizeLabel: l.size.label,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      lineTotal: l.lineTotal,
    })),
    subtotal: totals.subtotal,
    delivery: totals.delivery,
    total: totals.total,
    demo,
  };
}

function demoReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `DEMO-${s}`;
}

export const demoOrderService: OrderService = {
  async submit(cart, fields) {
    if (cart.lines.length === 0) throw new Error("Your bag is empty.");
    // Simulate network latency so loading states are exercised.
    await new Promise((r) => setTimeout(r, 900));
    return buildReceipt(cart, fields, demoReference(), true);
  },
};

export const orderService: OrderService = demoOrderService;

/* Receipt hand-off to the confirmation page (session only). */
const RECEIPT_KEY = "noire.lastOrder.v1";

export function storeReceipt(receipt: OrderReceipt): void {
  try {
    window.sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
  } catch {
    /* ignore */
  }
}

export function readReceipt(): OrderReceipt | null {
  try {
    const raw = window.sessionStorage.getItem(RECEIPT_KEY);
    return raw ? (JSON.parse(raw) as OrderReceipt) : null;
  } catch {
    return null;
  }
}
