# QA report

Date: **November 27, 2026**. Environment: Linux, Node 22.23, Chromium (Playwright 1.63),
local production build (`next build && next start`). Not yet tested on a deployed Vercel URL
or on physical phones — see "Not done" below.

## Automated results (actually executed)

| Check | Command | Result |
|---|---|---|
| Menu schema | `npm run validate:menu` | **0 errors**, 124 warnings (= every item awaiting owner approval, by design) |
| Typecheck (strict) | `npm run typecheck` | **Pass** |
| Lint | `npm run lint` | **Pass**, 0 warnings |
| Production build | `npm run build` | **Pass** — 15 routes, all static |
| Unit tests | `--project=unit` | **24 / 24 pass** |
| E2E desktop (1440px) | `--project=desktop` | **25 / 25 pass** |
| E2E mobile (Pixel 7) | `--project=mobile` | **25 / 25 pass** |
| Launch gate | `npm run check:launch` | **Fails as intended** — lists 8 owner/launch blockers |

Total: **74 / 74 tests passing** in `npm run verify`.

### What the tests cover (brief §26)

- Every route: HTTP 200, exactly one `<h1>`, **zero console or hydration errors**, no horizontal
  overflow, **zero axe violations for WCAG 2.0/2.1/2.2 A + AA**.
- 404 page.
- Business info: `tel:+15414796532` links, exact DoorDash URL with `rel=noopener`, Google
  directions link, address text, Restaurant JSON-LD with correct phone and **no rating markup**.
- Live hours in **restaurant time while the browser is set to New York** (open and closed cases).
- Desktop nav + `aria-current`; mobile menu open/navigate/auto-close; sticky action bar never
  covers the footer.
- Menu: search by name, by item number (`L3` → 1 dish), empty state, clear; menu fully present in
  server HTML (crawlable); category jump + scroll-spy highlight.
- Takeout list: add, size variant, subtotal ($29.50 exact), Escape closes, persists across reload,
  clear, "not an order" text, **no data sent anywhere**; per-person family dinner minimum.
- Seasonal preview changes `html[data-season]` and resets; fortune cookie; gallery lightbox
  keyboard arrows, Escape, focus return; `prefers-reduced-motion` disables animation; 320px width
  with no overflow; titles, canonical, sitemap, robots, OG image.

Unit tests: open/closed at 11:59, noon, closing-soon, 9:00 PM boundary, just after midnight,
Saturday→Tuesday skip, Monday closed, **both DST transitions**, holiday closure and early-close
overrides, grouped schedule; season boundaries in Pacific time, override/disable; search synonyms
(`tsos`, `general tao`, `szechuan`, `sauteed`); schema rejects duplicate ids, non-integer prices,
double pricing; no dietary claims present.

## Lighthouse (lab, local production build)

| Page | Device | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Home | Desktop | 100 | 100 | 100 | 66* | 0.8 s | 0 | 0 ms |
| Menu | Desktop | 100 | 100 | 100 | 66* | 0.7 s | 0 | 0 ms |
| Home | Mobile (simulated slow 4G) | 93–95 | 100 | 100 | 66* | 2.9–3.1 s | 0 | 90 ms |
| Menu | Mobile (simulated slow 4G) | 92–96 | 100 | 100 | 66* | 2.6–3.3 s | 0 | 90 ms |

\* SEO's only failing audit is `is-crawlable`, caused by the deliberate preview `noindex`. With
`previewMode = false` it has no other failing audits.

**Honest notes:** mobile lab LCP is above the 2.5 s target under Lighthouse's throttling; it is
text-render delay from the display web font (cut from 118 KB → 66 KB by dropping an unused axis).
These are **lab** numbers on a local server, not field data. Real-user LCP/INP should be read from
Vercel Speed Insights or Search Console after launch. If field LCP is above 2.5 s, the next lever is
`display: "optional"` for Fraunces (trades first-visit brand font for speed).

## Responsive review

Captured at 1440 and 390 for every route (`docs/screenshots/`), plus automated overflow checks at
320, 412 (Pixel 7) and 1440. Fixes made during review: mobile header overflow (7px at 390, 24px at
320 before fonts load), red hero panel now bleeds to the right edge on wide screens, cluttered hero
season art moved, gallery grid gap closed, page-header season art given a wash so the moon is visible.

## Defects found and fixed during QA

| Found by | Defect | Fix |
|---|---|---|
| axe | Amber small text on red/green (3.4:1) | New `amber-light` token (≥5:1) for small text |
| axe | Logo link's aria-label didn't match visible text | Removed override |
| axe | Gallery buttons' aria-label mismatch | Visible title + sr-only prefix |
| axe | Active sidebar number at 70% opacity on red | Full opacity when active |
| e2e | Scroll-spy not updating after jump link (scroll offsets stacked) | Position-based spy; single offset |
| e2e | Mobile bar covered controls scrolled into view | `scroll-padding-bottom` |
| e2e | Footer last 2px under mobile bar | Padding includes the bar's border |
| visual | "Sesame Chicken is mar Far…" casing bug | Copy rewritten |
| lint | setState in effect (header) | Menu-open state keyed to pathname |

## Not done / limitations

- **No deployment.** Requires owner approval and a Vercel Pro plan (`DEPLOYMENT.md`).
- **Menu not verified against the original** — no printed menu or PDF was supplied; data is from the
  prior prototype and every item is marked `pending`.
- **No photography** — all imagery is original illustration.
- Not tested on physical iOS/Android devices or Safari/Firefox engines (only Chromium here).
  Recommended before launch: iPhone Safari (safe-area bar, `tel:` links, `<dialog>`), Android Chrome.
- Manual screen-reader pass (VoiceOver/NVDA) not performed; automated axe only.
- Business facts from DoorDash and the storefront photo could not be re-fetched from this build
  environment (network policy); they rely on the brief's Nov 26 snapshot.

## Internal rubric (self-assessment, not a substitute for tests)

| Criterion | Max | Score | Evidence / gap |
|---|---|---|---|
| Original visual design | 25 | 22 | Fully original illustration system, varied compositions; lacks real photography |
| Authentic restaurant identity | 15 | 12 | Red/bamboo storefront cues, local history; logo and Chinese name unconfirmed |
| Menu usability | 15 | 14 | Search by name/number, sticky nav, list, print; PDF viewer awaits file |
| Mobile responsiveness | 15 | 14 | 320–1440 clean, action bar, safe areas; no physical-device test |
| Functional correctness | 10 | 10 | 72/72 tests incl. DST/holiday hours |
| Performance & accessibility | 10 | 9 | A11y 100, CLS 0; mobile lab LCP ~2.6–3.1 s |
| Local SEO | 5 | 4 | Metadata, JSON-LD, sitemap; held at noindex until launch |
| Maintainability & deployment | 5 | 4 | Config/data separation, validator, launch gate, docs; not deployed |
| **Total** | **100** | **89** | Below the 95 target mainly for owner-dependent items (photos, logo, verified menu, deployment) |
