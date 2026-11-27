// Usage: node scripts/screenshots.mjs [baseUrl] [outDir]
// Captures every major route at desktop and mobile widths.
import { chromium } from "playwright";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "docs/screenshots";
const routes = ["/", "/menu", "/about", "/gallery", "/visit", "/order", "/privacy", "/menu/print"];
const sizes = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 1 });
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const name = r === "/" ? "home" : r.slice(1).replace(/\//g, "-");
    await page.screenshot({ path: `${out}/${name}-${s.name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${s.name} ${r} ${overflow > 0 ? `OVERFLOW ${overflow}px` : "ok"}`);
  }
  await page.close();
}
await browser.close();
