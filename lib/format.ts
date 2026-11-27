import type { MenuItem } from "@/data/menu-schema";

export function formatCents(cents: number): string {
  const dollars = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `$${dollars}.${rest}`;
}

/** Plain price text for an item — used for screen readers and print. */
export function priceText(item: MenuItem): string {
  if (item.variants?.length) {
    return item.variants.map((v) => `${v.label} ${formatCents(v.priceCents)}`).join(", ");
  }
  if (item.priceCents !== undefined) {
    return item.perPerson ? `${formatCents(item.priceCents)} per person` : formatCents(item.priceCents);
  }
  return "Ask for price";
}

export function lowestPrice(item: MenuItem): number | undefined {
  if (item.variants?.length) return Math.min(...item.variants.map((v) => v.priceCents));
  return item.priceCents;
}
