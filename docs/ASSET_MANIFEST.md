# Asset manifest

Every visual on the site, where it came from, its licence, and its approval status.

| Asset | File | Source | Licence / rights | Status |
|---|---|---|---|---|
| Four-petal emblem & wordmark | `components/illustrations/Emblem.tsx`, `app/icon.svg` | Original, created for this project | Owned by the restaurant on handover | **Proposed** — replace with official logo if one exists; owner approval needed |
| Food photos: Orange Chicken, General Tso's Chicken, Broccoli Beef (background removed), Sweet & Sour Chicken (in-restaurant) | `public/images/menu/*.webp`, registered in `data/photos.ts` | Restaurant's own DoorDash store listing (merchant photos), imported Nov 2026 **at the owner's request** | Owner to confirm the restaurant supplied/owns these photos | In use on home, menu rows, gallery |
| Mar Far Chicken photo (background removed) | `public/images/menu/mar-far-chicken.webp` | Supplied directly by the owner (Nov 2026) | Owner's photo | In use: menu row, gallery |
| Takeout box, Mar Far plate (animated; drawn from the owner's photo), dim sum steamer, family table, sauce bowl, tea cup, steam | `components/illustrations/Food.tsx` | Original | Owned on handover | Approved for use as **illustration**; never as dish photos |
| Bamboo, plum branch, lotus, harvest moon, winter pines, sprig rule | `components/illustrations/Botanical.tsx` | Original | Owned on handover | In use |
| Storefront illustration | `components/illustrations/Storefront.tsx` | Original interpretation of the publicly described storefront (red awning, bamboo) | Owned on handover | In use; replace with approved exterior photo |
| Rice-paper texture | inline SVG noise in `app/globals.css` | Original (generated `feTurbulence`) | — | In use |
| Lattice band, double-rule frames, leaders | CSS in `app/globals.css` | Original | — | In use |
| Open Graph image | `app/opengraph-image.tsx` | Generated at build from text + palette | — | In use; swap for an approved photo composition later |
| Fonts: Fraunces, Manrope, Noto Serif SC | via `next/font/google` (self-hosted at build) | Google Fonts | SIL Open Font License 1.1 | In use |
| Icons | `lucide-react` | Lucide | ISC | In use |
| Decorative characters 四季美食 | Hero seal | Generic words ("four seasons · fine food") | — | Decorative only, `aria-hidden`; **not** presented as official signage |

## Removed from the legacy prototype

| Asset | Why removed |
|---|---|
| Square payments SDK + checkout | Unconfigured; would create a fake checkout |
| Catering request form | Did not send anywhere |
| Unattributed review quotes | Not traceable to real reviews |

## Photos

Four DoorDash listing photos are on the site (above). A fifth, Cashew Chicken Subgum Chow Mein, was **not** used: it sits in DoorDash's customer-upload folder (`/media/ugc/`), so it is a customer's photo rather than the restaurant's. DoorDash's store page is behind bot protection, so only the photos the earlier prototype already referenced could be imported; any other menu photos on the listing would need to be supplied directly.

More photos: Add owner-approved photos to `public/images/` and register them
in `data/gallery.ts` with `approved: true`, real `width`/`height`, descriptive `alt`, and a
`credit`. See `docs/PHOTO_SHOT_LIST.md`.
