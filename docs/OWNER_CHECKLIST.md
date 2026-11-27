# Owner confirmation checklist

The site is built and tested but is in **preview mode** until these are confirmed.
Tick each one, then tell the developer which settings to flip.

## Menu → `approvals.menuApproved`, menu.json `approval`
- [ ] Every dish name, number and price matches the current printed to-go menu (use `/menu/print` side by side)
- [ ] Lunch specials are served noon–4 PM, Tuesday–Saturday
- [ ] Spice-adjustable dishes and the extra-spicy +$1 charge are correct
- [ ] Combo / family-dinner contents and "4+ people adds…" bonuses are correct
- [ ] Featured dishes on the homepage are ones you want to promote: Mar Far Chicken, Orange Chicken, General Tso's, Potstickers, Crab Puffs, Egg Flower Soup, BBQ Pork Buns
- [ ] Any items no longer sold are marked
- [ ] Supply a PDF or photos of the printed menu for the menu viewer
- [ ] Bottled teas (Kang Shi Fu honey jasmine, lemon iced black tea, jasmine green tea, Walovi herbal tea) — do you sell them? At what price?
- [ ] Allergen / dietary information: the site makes **no** claims and asks customers to call. Confirm that's what you want.

## Business info → `approvals.businessInfoApproved`
- [ ] Name as you want it shown: "Four Seasons Restaurant" (some listings say "Four Seasons Chinese Restaurant")
- [ ] Address: 122 SE K Street, Grants Pass, OR 97526
- [ ] Phone: (541) 479-6532
- [ ] Hours: Tue–Sat noon–9 PM, closed Sun & Mon. Any upcoming holiday closures?
- [ ] DoorDash store link is yours and active
- [ ] Parking guidance you'd like to give
- [ ] Do you own `fourseasonschineserestaurantgp.com`? Facebook page URL? Google Business Profile access?

## Story → `approvals.storyApproved`
- [ ] "Part of the Grants Pass dining community since at least 2011" — OK? (A real opening year can replace this.)
- [ ] Recognition list (Sneak Preview 2011–2013, Nextdoor Neighborhood Favorite 2020–24) — OK to show?
- [ ] Ratings (DoorDash 4.8, Restaurantji 4.2, Nov 2026) — show them? (currently hidden)
- [ ] Earlier prototype said "family-run", "no MSG", "cooked to order" — are these true and do you want them back?

## Brand → `approvals.brandApproved`
- [ ] Do you have a logo file? If not, approve or reject the proposed four-petal "4S" emblem
- [ ] Your official Chinese name / characters (the site does not use any as official text)
- [ ] The illustration style and colours

## Launch
- [ ] Approve a Vercel **Pro** plan (commercial use) and who pays for it
- [ ] Approve the domain and DNS changes
- [ ] Analytics: currently **none**. Want any? (Would need a privacy-page update.)
- [ ] Final go-ahead for production launch

Developer steps after sign-off: set flags in `config/site.ts`, `previewMode = false`, menu items to
`approved`, set `NEXT_PUBLIC_SITE_URL`, run `npm run check:launch`, deploy (see `DEPLOYMENT.md`).
