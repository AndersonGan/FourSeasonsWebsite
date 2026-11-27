# Four Seasons Restaurant — website

Production website for **Four Seasons Restaurant**, 122 SE K Street, Grants Pass, Oregon.
A Chinese-American neighborhood kitchen: Mar Far chicken, dim sum, family dinners, takeout.

> **Status: preview.** Built and tested, not deployed. The site is set to `noindex` and shows a
> "Preview build" tag until the owner confirms the menu and business details —
> see [`docs/OWNER_CHECKLIST.md`](docs/OWNER_CHECKLIST.md).

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, essentials (address · hours with live open/closed · phone · DoorDash), favorites, Mar Far & pink sauce, family dinners, dim sum, interactive four-season showcase, takeout + fortune cookie, local story, visit/map |
| `/menu` | Full searchable HTML menu (by dish or item number like `L3`), sticky category tabs / sidebar, filters, personal takeout list, original-PDF viewer slot |
| `/menu/print` | Print-optimised two-column menu |
| `/about` | Story and sourced timeline |
| `/gallery` | Illustrated gallery with accessible lightbox (ready for approved photos) |
| `/visit` | Hours table, holiday overrides, directions, click-to-load map, FAQ |
| `/order` | Call for pickup, pickup address, DoorDash delivery, takeout-list summary |
| `/privacy` | Plain-language privacy notice matching what the site actually does |

## Stack

Next.js 16 (App Router, fully static), React 19, strict TypeScript, Tailwind CSS 4, original
inline SVG illustration, Lucide icons, Playwright + axe-core for tests. No database, CMS,
backend, analytics, payments or third-party scripts.

## Quick start

```bash
npm ci
npm run dev            # http://localhost:3000
npm run verify         # validate menu → typecheck → lint → production build → all tests
```

Other scripts: `npm run validate:menu`, `npm run check:launch` (fails until owner approvals are in),
`npm run test:unit`, `npm run test:e2e` (needs `npm run build` first),
`node scripts/screenshots.mjs http://localhost:3000 docs/screenshots`.

## Where things live

```
app/                 routes, layout, globals.css (design tokens), sitemap/robots/OG image
components/          layout/ home/ menu/ gallery/ illustrations/ seasonal/ interactive/ ui/
config/              restaurant.ts (NAP, hours, overrides, links, ratings) · site.ts (approval
                     switches, preview mode) · seasons.ts · announcements.ts
data/                menu.json (single source of truth, integer cents) · menu-schema.ts
                     (types + validator) · gallery.ts · fortunes.ts
lib/                 business-hours.ts (restaurant-local time) · season.ts · menu-search.ts · seo.ts
tests/unit, tests/e2e
docs/                research, design system, management, deployment, QA, owner checklist
legacy/              the earlier single-file prototype, kept for reference (not served)
```

## Editing content

Non-developers: see [`docs/MENU_MANAGEMENT.md`](docs/MENU_MANAGEMENT.md) — prices, sold-out dishes,
holiday closures, announcements, seasonal switch, adding the PDF menu.

## Documentation

- [Business research](docs/BUSINESS_RESEARCH.md) — facts, assumptions, discrepancies, sources
- [Design research](docs/DESIGN_RESEARCH.md) — references, three directions, decisions
- [Design system](docs/DESIGN_SYSTEM.md) — colour, type, components, seasons, motion
- [Menu management](docs/MENU_MANAGEMENT.md)
- [Asset manifest](docs/ASSET_MANIFEST.md) · [Photo shot list](docs/PHOTO_SHOT_LIST.md)
- [Deployment](docs/DEPLOYMENT.md) — Vercel, domain, Search Console, Business Profile
- [QA report](docs/QA_REPORT.md) · [Owner checklist](docs/OWNER_CHECKLIST.md)
- Screenshots: [`docs/screenshots/`](docs/screenshots)
