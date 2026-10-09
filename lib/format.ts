const pkr = new Intl.NumberFormat("en-PK", {
  style: "decimal",
  maximumFractionDigits: 0,
});

/** Formats an integer rupee amount as "PKR 32,500". */
export function formatPrice(amount: number): string {
  return `PKR ${pkr.format(Math.round(amount))}`;
}
