/**
 * Menu data types and validation. Self-contained (no imports) so it can run
 * both inside Next.js and directly in Node for `npm run validate:menu`.
 */

export type ApprovalStatus = "pending" | "approved" | "hidden";

/** Only add a flag after the restaurant has confirmed it for that exact dish. */
export type DietaryFlag = "vegetarian" | "vegan" | "gluten-free";

export interface PriceVariant {
  label: string;
  priceCents: number;
}

export interface OptionChoice {
  label: string;
  /** Extra charge for this choice, in cents. Omit or 0 for no charge. */
  deltaCents?: number;
}

export interface OptionGroup {
  label: string;
  choices: OptionChoice[];
}

export interface MenuItem {
  id: string;
  /** Number printed on the menu, e.g. "L3" or "4". */
  number?: string;
  name: string;
  description?: string;
  /** Single price in cents. Use `variants` instead when there are sizes. */
  priceCents?: number;
  variants?: PriceVariant[];
  perPerson?: boolean;
  minQuantity?: number;
  options?: OptionGroup[];
  /** For combination plates / family dinners: what comes on it. */
  components?: string[];
  /** Kitchen will adjust the heat on request (from the printed menu). */
  spiceAdjustable: boolean;
  dietary: DietaryFlag[];
  available: boolean;
  featured: boolean;
  image: string | null;
  sortOrder: number;
  /** Page of the original printed menu this came from, once checked. */
  sourcePage: number | null;
  approval: ApprovalStatus;
}

export interface MenuCategory {
  id: string;
  title: string;
  sortOrder: number;
  note?: string;
  servedWindow?: "lunch";
  items: MenuItem[];
}

export interface MenuMeta {
  title: string;
  pricesAsOf: string;
  source: string;
  /** Path under /public to the owner's original menu PDF, e.g. "/menu/four-seasons-to-go-menu.pdf". */
  originalDocument: string | null;
  approval: ApprovalStatus;
  currency: "USD";
  notes: string[];
  spice: { levels: string[]; extraSpicyCents: number };
}

export interface MenuData {
  meta: MenuMeta;
  categories: MenuCategory[];
}

export interface ValidationIssue {
  level: "error" | "warning";
  path: string;
  message: string;
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIETARY: readonly string[] = ["vegetarian", "vegan", "gluten-free"];
const APPROVAL: readonly string[] = ["pending", "approved", "hidden"];

function isCents(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0 && n < 100_000;
}

export function validateMenu(data: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (path: string, message: string) => issues.push({ level: "error", path, message });
  const warn = (path: string, message: string) => issues.push({ level: "warning", path, message });

  if (!data || typeof data !== "object") {
    err("$", "Menu file is not an object.");
    return issues;
  }
  const menu = data as Partial<MenuData>;
  if (!menu.meta) err("meta", "Missing meta block.");
  else {
    if (!menu.meta.pricesAsOf) err("meta.pricesAsOf", "Say when prices were last checked.");
    if (!APPROVAL.includes(menu.meta.approval as string)) err("meta.approval", "Must be pending, approved or hidden.");
    if (menu.meta.originalDocument && !menu.meta.originalDocument.startsWith("/")) {
      err("meta.originalDocument", "Use a path under /public, starting with '/'.");
    }
  }
  if (!Array.isArray(menu.categories) || menu.categories.length === 0) {
    err("categories", "No categories.");
    return issues;
  }

  const catIds = new Set<string>();
  const itemIds = new Set<string>();
  const numbers = new Map<string, string>();

  menu.categories.forEach((cat, ci) => {
    const cp = `categories[${ci}](${cat?.id ?? "?"})`;
    if (!cat.id || !ID_RE.test(cat.id)) err(cp, "Category id must be lowercase-with-dashes.");
    if (catIds.has(cat.id)) err(cp, `Duplicate category id "${cat.id}".`);
    catIds.add(cat.id);
    if (!cat.title?.trim()) err(cp, "Category needs a title.");
    if (!Array.isArray(cat.items) || cat.items.length === 0) {
      err(cp, "Category has no items.");
      return;
    }
    cat.items.forEach((item, ii) => {
      const p = `${cp}.items[${ii}](${item?.id ?? "?"})`;
      if (!item.id || !ID_RE.test(item.id)) err(p, "Item id must be lowercase-with-dashes.");
      if (itemIds.has(item.id)) err(p, `Duplicate item id "${item.id}".`);
      itemIds.add(item.id);
      if (!item.name?.trim()) err(p, "Item needs a name.");
      if (item.number) {
        const key = item.number.toUpperCase();
        if (numbers.has(key)) err(p, `Item number ${item.number} is also used by ${numbers.get(key)}.`);
        numbers.set(key, item.id);
      }
      const hasPrice = item.priceCents !== undefined;
      const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
      if (hasPrice && hasVariants) err(p, "Use either priceCents or variants, not both (one price per entry).");
      if (!hasPrice && !hasVariants) err(p, "Missing price.");
      if (hasPrice && !isCents(item.priceCents)) err(p, `Invalid price ${String(item.priceCents)} — use whole cents, e.g. 1075.`);
      if (hasVariants) {
        const labels = new Set<string>();
        item.variants!.forEach((v, vi) => {
          if (!v.label?.trim()) err(`${p}.variants[${vi}]`, "Variant needs a label.");
          if (labels.has(v.label)) err(`${p}.variants[${vi}]`, `Duplicate variant "${v.label}".`);
          labels.add(v.label);
          if (!isCents(v.priceCents)) err(`${p}.variants[${vi}]`, `Invalid price ${String(v.priceCents)}.`);
        });
      }
      item.options?.forEach((o, oi) => {
        if (!o.label?.trim() || !Array.isArray(o.choices) || o.choices.length === 0) {
          err(`${p}.options[${oi}]`, "Option group needs a label and at least one choice.");
        }
        o.choices?.forEach((c, cci) => {
          if (c.deltaCents !== undefined && !(Number.isInteger(c.deltaCents) && c.deltaCents >= 0)) {
            err(`${p}.options[${oi}].choices[${cci}]`, "deltaCents must be a whole number ≥ 0.");
          }
        });
      });
      if (item.perPerson && !(Number.isInteger(item.minQuantity) && (item.minQuantity ?? 0) >= 1)) {
        err(p, "Per-person items need a minQuantity.");
      }
      if (!Array.isArray(item.dietary)) err(p, "dietary must be a list (use [] when unconfirmed).");
      else item.dietary.forEach((d) => !DIETARY.includes(d) && err(p, `Unknown dietary flag "${d}".`));
      if (typeof item.spiceAdjustable !== "boolean") err(p, "spiceAdjustable must be true or false.");
      if (typeof item.available !== "boolean") err(p, "available must be true or false.");
      if (typeof item.featured !== "boolean") err(p, "featured must be true or false.");
      if (!APPROVAL.includes(item.approval)) err(p, "approval must be pending, approved or hidden.");
      if (item.image !== null && typeof item.image !== "string") err(p, "image must be a path or null.");
      if (item.approval === "pending") warn(p, "Awaiting owner confirmation.");
      if (item.approval === "approved" && item.sourcePage === null) warn(p, "Approved item has no sourcePage.");
    });
  });
  return issues;
}
