/**
 * Content validation.
 *   npm run validate:menu   — schema checks; fails on errors (CI / every build)
 *   npm run check:launch    — also fails while owner approvals are outstanding
 */
import fs from "node:fs";
import path from "node:path";
import { validateMenu } from "../data/menu-schema.ts";

const root = path.resolve(import.meta.dirname, "..");
const launch = process.argv.includes("--launch");
const menu = JSON.parse(fs.readFileSync(path.join(root, "data/menu.json"), "utf8"));
const issues = validateMenu(menu);
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

for (const e of errors) console.error(`ERROR  ${e.path}: ${e.message}`);
const items = menu.categories.reduce((n: number, c: { items: unknown[] }) => n + c.items.length, 0);
console.log(`Menu: ${menu.categories.length} sections, ${items} items, ${errors.length} errors, ${warnings.length} warnings.`);

if (menu.meta.originalDocument) {
  const f = path.join(root, "public", menu.meta.originalDocument);
  if (!fs.existsSync(f)) {
    console.error(`ERROR  meta.originalDocument: file not found at public${menu.meta.originalDocument}`);
    errors.push({ level: "error", path: "meta.originalDocument", message: "missing file" });
  }
}

if (launch) {
  const blockers: string[] = [];
  const site = fs.readFileSync(path.join(root, "config/site.ts"), "utf8");
  for (const key of ["menuApproved", "businessInfoApproved", "storyApproved", "brandApproved"]) {
    if (new RegExp(`${key}:\\s*false`).test(site)) blockers.push(`config/site.ts → approvals.${key} is false`);
  }
  if (/previewMode\s*=\s*true/.test(site)) blockers.push("config/site.ts → previewMode is true (site is set to noindex)");
  if (menu.meta.approval !== "approved") blockers.push("data/menu.json → meta.approval is not \"approved\"");
  const pending = warnings.filter((w) => w.message.startsWith("Awaiting")).length;
  if (pending) blockers.push(`${pending} menu items still have approval "pending"`);
  if (!process.env.NEXT_PUBLIC_SITE_URL) blockers.push("NEXT_PUBLIC_SITE_URL is not set (canonical URLs / sitemap)");
  if (blockers.length) {
    console.error("\nNot ready to launch:\n  - " + blockers.join("\n  - "));
    console.error("\nSee docs/OWNER_CHECKLIST.md.");
    process.exit(1);
  }
  console.log("Launch checks passed.");
}

if (errors.length) process.exit(1);
