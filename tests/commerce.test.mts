import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cartReducer,
  cartTotals,
  emptyCart,
  sanitizeCart,
  MAX_QTY,
  DELIVERY_FEE,
} from "../lib/cart/cart.ts";
import { normalizePkPhone, validateCheckout, emptyCheckout } from "../lib/checkout/validation.ts";
import { buildReceipt } from "../lib/orders/orderService.ts";
import { formatPrice } from "../lib/format.ts";
import { products } from "../lib/products.ts";

test("add merges identical lines and keeps sizes separate", () => {
  let s = cartReducer(emptyCart, { type: "add", productId: "oud", sizeId: "100" });
  s = cartReducer(s, { type: "add", productId: "oud", sizeId: "100", quantity: 2 });
  s = cartReducer(s, { type: "add", productId: "oud", sizeId: "50" });
  assert.equal(s.lines.length, 2);
  assert.equal(s.lines[0].quantity, 3);
});

test("rejects unknown products and sizes", () => {
  let s = cartReducer(emptyCart, { type: "add", productId: "nope", sizeId: "100" });
  s = cartReducer(s, { type: "add", productId: "oud", sizeId: "999" });
  assert.equal(s.lines.length, 0);
});

test("quantities are clamped and zero removes the line", () => {
  let s = cartReducer(emptyCart, { type: "add", productId: "amber", sizeId: "50", quantity: 50 });
  assert.equal(s.lines[0].quantity, MAX_QTY);
  s = cartReducer(s, { type: "setQuantity", productId: "amber", sizeId: "50", quantity: 0 });
  assert.equal(s.lines.length, 0);
});

test("totals: subtotal, free delivery threshold, fee below it", () => {
  let s = cartReducer(emptyCart, { type: "add", productId: "amber", sizeId: "50" }); // 18,500
  let t = cartTotals(s);
  assert.equal(t.subtotal, 18500);
  assert.equal(t.delivery, DELIVERY_FEE);
  assert.equal(t.total, 18500 + DELIVERY_FEE);
  s = cartReducer(s, { type: "add", productId: "oud", sizeId: "100", quantity: 2 }); // +65,000
  t = cartTotals(s);
  assert.equal(t.count, 3);
  assert.equal(t.subtotal, 83500);
  assert.equal(t.delivery, 0);
  assert.equal(cartTotals(emptyCart).total, 0);
});

test("sanitizeCart tolerates corrupt storage", () => {
  assert.deepEqual(sanitizeCart(null), emptyCart);
  assert.deepEqual(sanitizeCart({ lines: "x" }), emptyCart);
  const s = sanitizeCart({
    lines: [
      { productId: "oud", sizeId: "100", quantity: "2" },
      { productId: "oud", sizeId: "100", quantity: 1 },
      { productId: "ghost", sizeId: "100", quantity: 1 },
      { productId: "velvet", sizeId: "50", quantity: -3 },
      42,
    ],
  });
  assert.deepEqual(s.lines, [{ productId: "oud", sizeId: "100", quantity: 3 }]);
});

test("phone normalisation", () => {
  assert.equal(normalizePkPhone("0300 1234567"), "+923001234567");
  assert.equal(normalizePkPhone("+92 321-7654321"), "+923217654321");
  assert.equal(normalizePkPhone("923001234567"), "+923001234567");
  assert.equal(normalizePkPhone("042 1234567"), null);
  assert.equal(normalizePkPhone("0300123"), null);
});

test("checkout validation", () => {
  const empty = validateCheckout(emptyCheckout);
  assert.ok(empty.name && empty.phone && empty.address && empty.city);
  assert.equal(empty.email, undefined);
  const ok = validateCheckout({
    name: "Ayesha Khan",
    phone: "0300 1234567",
    email: "",
    address: "House 12, Street 4, Gulgasht Colony",
    city: "Multan",
    notes: "",
  });
  assert.deepEqual(ok, {});
  assert.ok(validateCheckout({ ...emptyCheckout, email: "bad@" }).email);
});

test("receipt snapshot matches cart totals", () => {
  const s = cartReducer(emptyCart, { type: "add", productId: "intense", sizeId: "100" });
  const r = buildReceipt(
    s,
    { name: "A B C", phone: "03001234567", email: "", address: "1234567890 street", city: "Lahore", notes: "" },
    "DEMO-TEST",
    true,
  );
  assert.equal(r.total, 36000);
  assert.equal(r.lines[0].name, "NOIRÉ Intense");
  assert.equal(r.customer.phone, "+923001234567");
  assert.equal(r.demo, true);
});

test("catalogue integrity", () => {
  const ids = new Set<string>();
  for (const p of products) {
    assert.ok(!ids.has(p.id));
    ids.add(p.id);
    assert.ok(p.sizes.some((s) => s.id === p.defaultSizeId));
    assert.ok(p.notes.length >= 3);
    for (const s of p.sizes) assert.ok(Number.isInteger(s.price) && s.price > 0);
  }
  assert.equal(formatPrice(32500), "PKR 32,500");
});
