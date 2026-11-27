/**
 * QR-code stickers for old printed to-go menus.
 *
 *   node scripts/make-qr-stickers.mjs [url]
 *
 * Output (docs/print/):
 *   qr-menu-stickers-letter-30up.pdf  — print this onto the label sheets
 *   qr-menu-sticker-preview.png       — one sticker, enlarged, for checking
 *   qr-menu-code.svg                  — the QR code alone (for other uses)
 *
 * Label stock: 1" × 2-5/8" address labels, 30 per US-letter sheet
 * (Avery 5160 layout): 3 columns × 10 rows, 0.5" top/bottom margin,
 * 3/16" side margin, 1/8" gap between columns.
 *
 * Print at "Actual size" / 100% scale — never "Fit to page".
 */
import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { chromium } from "playwright";

const URL_TARGET = process.argv[2] ?? "https://fourseasonsgp.vercel.app/menu";
const OUT = path.resolve("docs/print");
fs.mkdirSync(OUT, { recursive: true });

// Medium error correction keeps the code coarse enough to scan at ~0.8" wide.
const qrSvg = await QRCode.toString(URL_TARGET, { type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: "#000000", light: "#ffffff" } });
fs.writeFileSync(path.join(OUT, "qr-menu-code.svg"), qrSvg);
const qrInner = qrSvg.replace(/^<\?xml[^>]*>/, "");
const modules = Number(qrSvg.match(/viewBox="0 0 (\d+) \d+"/)?.[1] ?? 0);

const displayUrl = URL_TARGET.replace(/^https?:\/\//, "");

const emblem = `<svg viewBox="0 0 64 64" class="emblem" aria-hidden="true"><g transform="translate(32 32)">
<path d="M0-4C-9-12-8-27 0-30 8-27 9-12 0-4Z" fill="#EDA9B1"/><path d="M4 0C12-9 27-8 30 0 27 8 12 9 4 0Z" fill="#246B54"/>
<path d="M0 4C9 12 8 27 0 30-8 27-9 12 0 4Z" fill="#E8B64B"/><path d="M-4 0C-12 9-27 8-30 0-27-8-12-9-4 0Z" fill="#263A4F"/>
<circle r="11" fill="#B82025"/><text y="3.6" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="10" fill="#FFF2DB">4S</text></g></svg>`;

const sticker = `
<div class="sticker">
  <div class="qr">${qrInner}</div>
  <div class="text">
    <div class="eyebrow">Prices have changed</div>
    <div class="title">Scan for today’s<br/>menu &amp; prices</div>
    <div class="foot">${emblem}<span>Four Seasons · (541) 479-6532</span></div>
  </div>
</div>`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Manrope:wght@600;800&display=block');
@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 8.5in; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sheet { width: 8.5in; height: 11in; padding: 0.5in 0.1875in; display: grid;
  grid-template-columns: repeat(3, 2.625in); grid-template-rows: repeat(10, 1in); column-gap: 0.125in; }
.sticker { width: 2.625in; height: 1in; display: flex; align-items: center; gap: 0.07in; padding: 0.07in 0.08in 0.07in 0.11in; overflow: hidden; }
.qr { width: 0.84in; height: 0.84in; flex: none; }
.qr svg { width: 100%; height: 100%; display: block; shape-rendering: crispEdges; }
.text { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; border-left: 1.5pt solid #B82025; padding-left: 0.07in; height: 0.8in; }
.eyebrow { font: 800 5.6pt/1 Manrope, sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: #B82025; }
.title { font: 600 11.2pt/1.02 Fraunces, Georgia, serif; color: #24211D; margin-top: 3pt; letter-spacing: -0.01em; }
.foot { display: flex; align-items: center; gap: 2.5pt; margin-top: 4pt; font: 600 5.3pt/1 Manrope, sans-serif; color: #246B54; white-space: nowrap; }
.emblem { width: 9pt; height: 9pt; flex: none; }
.sheet.guides .sticker { outline: 0.5pt dashed #bbb; outline-offset: -0.25pt; }
`;

const page = (guides) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>
<body><div class="sheet${guides ? " guides" : ""}">${Array.from({ length: 30 }, () => sticker).join("")}</div></body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage();

// Production sheet (no guide lines).
await p.setContent(page(false), { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: path.join(OUT, "qr-menu-stickers-letter-30up.pdf"), width: "8.5in", height: "11in", printBackground: true, preferCSSPageSize: true });

// Test sheet with dashed outlines: print on plain paper, hold it behind a label sheet up to the light.
await p.setContent(page(true), { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: path.join(OUT, "qr-menu-stickers-ALIGNMENT-TEST.pdf"), width: "8.5in", height: "11in", printBackground: true, preferCSSPageSize: true });

// Enlarged preview of one sticker (4× scale).
const pv = await browser.newPage({ viewport: { width: 300, height: 120 }, deviceScaleFactor: 4 });
await pv.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css} body{width:auto;padding:0.1in;background:#e9e4da}.sticker{background:#fff;border-radius:0.06in;box-shadow:0 1px 3px rgba(0,0,0,.25)}</style></head><body>${sticker}</body></html>`, { waitUntil: "networkidle" });
await pv.evaluate(() => document.fonts.ready);
await pv.locator(".sticker").screenshot({ path: path.join(OUT, "qr-menu-sticker-preview.png"), scale: "device" });

await browser.close();
console.log(`QR → ${URL_TARGET}  (${modules}×${modules} modules, ${(0.84 / modules * 25.4).toFixed(2)} mm per module)`);
console.log(`Wrote ${OUT}/qr-menu-stickers-letter-30up.pdf, qr-menu-stickers-ALIGNMENT-TEST.pdf, qr-menu-sticker-preview.png, qr-menu-code.svg`);
