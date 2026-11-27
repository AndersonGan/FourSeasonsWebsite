# Design system

Tokens live in `app/globals.css` (`@theme`), so they're available as Tailwind classes
(`bg-red`, `text-bamboo`, …) and CSS variables (`var(--color-red)`).

## Colour

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `red` | #B82025 | Master identity; headings, primary buttons, colour fields | 5.8:1 on paper |
| `red-deep` | #8F161B | Button shadows, eyebrow on pink/amber | 4.75:1 on pink |
| `bamboo` | #246B54 | Master identity; links, secondary buttons, dim sum field | 5.7:1 on paper |
| `bamboo-deep` | #17493A | Footer | — |
| `paper` | #FFF2DB | Page background ("rice paper") | — |
| `paper-deep` / `paper-edge` | #F6E3C2 / #E9D2A8 | Bands, dividers | — |
| `amber` | #E8B64B | Accents; **large** text on red/green only (3.4:1) | never small text |
| `amber-light` | #FFE3A3 | Small text on red/green (≥5:1) | 5.1:1 on red |
| `pink` / `pink-soft` | #EDA9B1 / #F8DADE | Mar Far / pink-sauce field, menu target highlight | — |
| `ink` / `ink-soft` | #24211D / #5A5148 | Body text / secondary text | 6.2:1 on paper-deep |
| `mandarin` / `mandarin-ink` | #DC703B / #A64A1F | Spice icon, notices (use `-ink` for text) | 5.2:1 on paper |

Rules: red + green identity never changes with the season. Seasonal colour only reaches the
`--season-*` variables and seasonal artwork. Every text pairing in the build passes axe WCAG
2.2 AA (enforced in `tests/e2e/site.spec.ts`).

## Type

- **Fraunces** (display, variable `opsz`) — headings, prices, numbers. Italic for the second
  beat of a headline ("Good food. *Good company.*").
- **Manrope** — body, UI, eyebrows (800, 0.16em tracking, uppercase).
- **Noto Serif SC 700** — decorative Chinese only, not preloaded, `aria-hidden`, `lang="zh-Hans"`.
  Do not set unverified Chinese as meaningful text.

All fonts are self-hosted by `next/font` at build time (no Google requests from visitors).

## Layout & components

- Max width `max-w-7xl`, 16px gutters on phones (`px-4`), 24px from `sm`.
- Sections alternate **paper → colour field** with asymmetric two-column grids; no two
  consecutive sections share a composition.
- Signature details: double-rule `.menu-frame`, `.lattice` band, dotted `.leader` between dish
  and price, `.eyebrow`, vertical `.seal`, rotating "since 2011" stamp.
- Buttons (`components/ui/Button.tsx`): `red` (primary), `green`, `outline`, `paper`, `ghost`.
  3px radius, 48px min height, a solid 3px "print" shadow instead of blurry shadows.
- Touch targets ≥ 40px; mobile action bar 64px plus safe-area inset; page bottom padding
  matches it so content is never covered.

## Illustration rules

`components/illustrations/*` — flat shapes, 2–3px ink outline, palette colours only, no
gradients. Food is drawn as recognisable shapes (Mar Far slices, pleated dumplings, folded
box), never photorealistic, never presented as a photo. All decorative SVG is `aria-hidden`
with a text alternative nearby when it carries meaning.

## Seasonal system

`config/seasons.ts` + `lib/season.ts`. A tiny inline script sets `<html data-season>` from the
**restaurant-local** month before first paint; CSS shows the matching artwork
(`components/seasonal/SeasonalArt.tsx`). No hydration mismatch, no layout shift. Switches:
`enabled` (off → fallback), `override` (force one season).

## Motion

CSS only: steam rising, bamboo sway, a falling petal, the 2011 stamp landing, fortune cookie
opening, hover lifts. All disabled by `prefers-reduced-motion` (tested). No scroll hijacking,
loaders or autoplay.
