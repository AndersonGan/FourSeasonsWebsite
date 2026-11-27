# Menu & content management (for non-developers)

Everything a customer sees comes from four files. You can edit them on GitHub in the browser
(pencil icon → "Commit changes"); Vercel rebuilds the site automatically in about a minute.

| What | File |
|---|---|
| Dishes and prices | `data/menu.json` |
| Hours, phone, address, holiday closures, links, ratings | `config/restaurant.ts` |
| Announcement strip at the top | `config/announcements.ts` |
| Seasonal art on/off | `config/seasons.ts` |

After any menu change, a developer (or GitHub Actions, if set up) should run
`npm run validate:menu`. The build will not catch a typo in a price; the validator will.

## Everyday edits

### Change a price
Prices are **whole cents**: `$10.75` is `1075`. Find the dish in `data/menu.json` and change
`"priceCents"`. For dishes with sizes, change the `"priceCents"` inside `"variants"`.
Update `"pricesAsOf"` at the top of the file.

### Mark a dish sold out (temporarily)
Set `"available": false`. It stays on the menu with "Currently unavailable" and can't be added
to a takeout list. Set back to `true` when it's back.

### Remove a dish
Set `"approval": "hidden"` (keeps the record), or delete its whole `{ … }` block.

### Add a dish
Copy an existing dish block in the same section and change: `id` (unique, lowercase-with-dashes),
`name`, `priceCents`, `description` (optional), `sortOrder`. Keep `"dietary": []` unless the
kitchen has confirmed a dietary claim for that exact dish.

### Close for a holiday / change hours for a day
In `config/restaurant.ts`, add to `hoursOverrides`:
```ts
hoursOverrides: [
  { date: "2026-12-25", intervals: [], label: "Closed for Christmas" },
  { date: "2026-12-24", intervals: [{ open: "12:00", close: "17:00" }], label: "Christmas Eve — closing at 5" },
],
```
The "Open now" badge, Visit page and search-engine data all use it.
Also post it in the announcement strip:
```ts
// config/announcements.ts
export const announcements = [
  { id: "xmas", text: "Closed Christmas Day. Open again Saturday at noon.", start: "2026-12-15", end: "2026-12-26" },
];
```

### Turn off the live "Open now" badge
`showLiveOpenStatus: false` in `config/restaurant.ts`. The weekly schedule still shows.

### Seasonal art
`config/seasons.ts`: `enabled: false` to stop changing with the season; `override: "winter"` to
force one.

## Adding the original printed menu (PDF)

1. Put the file at `public/menu/four-seasons-to-go-menu.pdf`.
2. In `data/menu.json`, set `"originalDocument": "/menu/four-seasons-to-go-menu.pdf"`.
3. The menu page then shows a viewer with Download, Full screen and Print.

## Importing / verifying the official menu (first-time workflow)

The current data was transcribed in the earlier prototype and has **not** been compared with
the original. To verify:

1. Open the printed menu next to `/menu/print` (same order as the paper menu).
2. For each dish check: number, exact name/spelling, description, every price and size, combo
   contents, lunch window, notes. Record the **page number** in `"sourcePage"`.
3. Change `"approval": "pending"` → `"approved"` for each checked dish.
4. Write any differences in a short discrepancy list (dish, website said, menu says, fixed?).
5. Never infer allergens, vegetarian/vegan, MSG-free or gluten-free status from a dish name or
   category. Only add `dietary` flags the kitchen confirms.
6. When every dish is approved, set `"meta": { "approval": "approved" }`. This also turns on
   menu structured data for Google.

## Schema reference

`data/menu-schema.ts` documents each field. The validator rejects: duplicate ids or item
numbers, missing or non-integer prices, both `priceCents` and `variants` on one dish, unknown
dietary flags, per-person dishes without a minimum, and a missing PDF file.
