# Business research — Four Seasons Restaurant, Grants Pass

Research date: **November 27, 2026** (brief's sources were checked November 26, 2026).
Public listings change. Nothing in the "unverified" or "not approved" sections may be
published without owner confirmation.

## 1. Corroborated public facts (two or more sources agree)

| Fact | Value | Sources |
|---|---|---|
| Name | Four Seasons Restaurant | Restaurantji [2], DoorDash [3], Nextdoor [7] |
| Address | 122 SE K Street, Grants Pass, OR 97526 | Restaurantji [2], MapQuest [17], legacy prototype |
| Phone | (541) 479-6532 | Restaurantji [2], legacy prototype |
| Cuisine | Chinese / Chinese-American, dim sum | DoorDash [3], Restaurantji [2] |
| Services | Dine-in, takeout, DoorDash delivery | DoorDash [3], Restaurantji [2] |
| Weekly hours | Tue–Sat 12:00–21:00; closed Sun & Mon | Restaurantji [2], legacy prototype |
| Operating since at least 2011 | Sneak Preview "Best of Grants Pass" 2011/2012/2013 | [4], [5], [6] |

## 2. Owner-approved facts

**None yet.** Every item in `docs/OWNER_CHECKLIST.md` is open. The site runs with
`previewMode = true` and all `approvals.*` flags false in `config/site.ts`.

## 3. Research-supported assumptions (used on the site, pending approval)

| Assumption | Where used | Basis |
|---|---|---|
| Menu names & in-store prices (July 2026) | `/menu`, homepage | Transcribed in the repository's earlier prototype (`legacy/index.html`), which labels them "in-store prices from the printed menu, July 2026". **Not compared with the original printed menu** — no PDF/images were supplied. |
| Lunch specials noon–4 PM | `/menu`, `/visit` | Legacy prototype transcription |
| Spice-adjustable dishes (flame icon) | `/menu` | Legacy prototype: "can be made no spice … extra spicy (+$1)" |
| Recognition list (2011–2013 Sneak Preview, 2020–24 Nextdoor) | Home, `/about` | [4]–[7]; wording kept to what the sources state |
| Approximate map coordinates | JSON-LD only | Estimated; owner should confirm Google Business Profile pin |

## 4. Unverified history — NOT published

- Founding date, owners, family history, ownership continuity.
- "Family-run", "no MSG", "cooked to order", "nothing under a heat lamp", "pickup in 15 minutes" —
  these claims appear in the legacy prototype but have no public source. **Removed** pending owner confirmation.
- "Four Seasons Restaurant LLC" appears in county property records [1]; relationship to the
  operating business not confirmed. Not used.

## 5. Content not approved for publication

- **Ratings** (DoorDash 4.8/5, 200+ ratings; Restaurantji 4.2/5, 191 ratings — November 2026 snapshot).
  Stored in `config/restaurant.ts` with platform and date; hidden (`showRatings: false`) until approved.
  Stacker's July 2025 Yelp-based list showed **3.8/5 from 86 Yelp reviews** for "Four Seasons Chinese Restaurant" [18] — another reason to show ratings only with platform + date.
- **Testimonials:** the legacy prototype showed three short quotes "from our Google reviews". They could not be traced to specific reviews and were **removed**. No testimonials are published.
- **Chinese name / characters:** `四季` stored with `chineseNameApproved: false`. The hero seal `四季美食` ("four seasons · delicious food") is decorative and marked `aria-hidden`; it is not presented as signage.
- **Bottled teas** (Kang Shi Fu honey jasmine, lemon iced black tea, jasmine green, Walovi herbal) — named in the brief "to confirm"; not in the transcribed menu, so not shown.
- **Pink sauce:** the site describes pink sauce as a Southern Oregon Mar Far tradition and asks customers to "ask about sauces." It does not claim Four Seasons serves, makes, or invented a pink sauce.
- **DoorDash photography:** four of the restaurant's DoorDash listing photos were re-imported on the owner's request (Nov 27, 2026); see `ASSET_MANIFEST.md`. A customer-uploaded photo was excluded.
- **Old domain** `fourseasonschineserestaurantgp.com` — ownership unverified; not linked.
- **Facebook page** — not confirmed; `links.facebook` is `null`.

## 6. Discrepancies

| Topic | Discrepancy | Handling |
|---|---|---|
| Business name | "Four Seasons Restaurant" (DoorDash, Restaurantji) vs "Four Seasons Chinese Restaurant" (MapQuest [17], Stacker [18]) | Use "Four Seasons Restaurant"; owner to confirm |
| Ratings | 4.8 (DoorDash), 4.2 (Restaurantji), 3.8 (Yelp via Stacker, 2025) | Hidden; if shown, always with platform + date |
| Online ordering | Legacy prototype had a Square checkout (unconfigured placeholder keys) and an `order.online` link | Removed. No payments on the site; pickup by phone, delivery via the DoorDash store link in the brief |
| Catering | Prototype had a catering page + form that didn't submit anywhere | Removed (fake form). Family dinners section covers group meals; catering can return with owner-approved details |
| Family dinner price range | Prototype homepage said "$18.25 to $20.25"; data has Style A $18.50, B $19.25, C $20.25, D $18.25 | Consistent with data ($18.25–$20.25); site shows per-style prices from data only |
| Competitor status | MapQuest capture shows Hunan Garden "closed" | Not referenced on the site |

## 7. Competitive snapshot (Grants Pass Chinese restaurants)

| Restaurant | Address (as listed) | Public signal | Notes for our design |
|---|---|---|---|
| Hong Kong Restaurant | NW 6th St area (address unconfirmed) | DoorDash 4.3, 300+ ratings [19] | Traditional, value portions; no strong web identity found |
| Hunan Garden | 929 NE D St | Yelp 2.7/99 (Stacker 2025); MapQuest showed "closed" | Status unverified — confirm before referencing |
| China Hut | 1434 NW 6th St | Yelp 2.6/103 (Stacker 2025) | Budget positioning |

Takeaway: none of the local competitors found has a distinctive, mobile-first site with a
searchable HTML menu. Four Seasons can win on (1) an instantly usable phone menu,
(2) one-tap call/directions, and (3) a warm, recognisable identity.

## Sources

1. Josephine County property record — https://jcpa.josephinecounty.gov/Property-Detail/PropertyQuickRefID/P143445
2. Restaurantji — https://www.restaurantji.com/or/grants-pass/four-seasons-restaurant-/
3. DoorDash — https://www.doordash.com/store/four-seasons-restaurant-grants-pass-37535244/
4. Sneak Preview 2011 — https://sneakpre.com/best-of/best-of-grants-pass-2011/
5. Sneak Preview 2012 — https://sneakpre.com/best-of/best-of-grants-pass-2012/
6. Sneak Preview 2013 — https://sneakpre.com/best-of/best-of-grants-pass-2013/
7. Nextdoor — https://nextdoor.com/pages/four-seasons-grants-pass-or/
8. Storefront photo (reference only) — https://static.goto-where.com/53789-albums-3.jpg
9. Public menus (cross-check only) — https://www.zmenu.com/four-seasons-grants-pass-online-menu/ · https://restaurantguru.com/Four-Seasons-Grants-Pass/menu
17. MapQuest listing — https://startpage.mapquest.com/us/oregon/four-seasons-chinese-restaurant-304517292
18. Stacker, highest-rated Chinese restaurants in Grants Pass — https://stacker.com/stories/oregon/grants-pass/highest-rated-chinese-restaurants-grants-pass
19. DoorDash Chinese in Grants Pass — https://doordash.com/food-delivery/grants-pass-or-restaurants/chinese/

**Access note:** this build environment's network blocked direct fetches of DoorDash and the
storefront photo host, so items [3] and [8] rely on the brief's November 26 snapshot plus search
results; re-check them in a browser before launch.
