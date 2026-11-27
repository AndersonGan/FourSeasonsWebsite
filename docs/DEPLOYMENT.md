# Deployment (GitHub → Vercel)

**Status: not deployed.** No Vercel account, domain or DNS was touched, and nothing was purchased.
Deploying requires the owner's authorisation (see `OWNER_CHECKLIST.md`).

## Requirements

- Node.js ≥ 20.9 (22 recommended; `.nvmrc` = 22). `package-lock.json` is committed.
- Next.js 16 (App Router), fully static output — no server functions, database or secrets.

## 1. Plan choice

Vercel's **Hobby** plan is for personal, non-commercial use; a restaurant's website is
commercial, so use **Pro** (check current pricing at https://vercel.com/pricing and the fair-use
guidelines at https://vercel.com/docs/limits/fair-use-guidelines before signing up).
The owner must approve this cost.

## 2. Import the repository

1. vercel.com → **Add New… → Project** → import `andersongan/fourseasonswebsite`.
2. Framework preset: **Next.js** (auto-detected). Build command `next build`, output default,
   install `npm ci`. Root directory: repository root.
3. Environment variable (Production): `NEXT_PUBLIC_SITE_URL = https://<final-domain>` — used for
   canonical URLs, sitemap and Open Graph. (Preview deployments fall back to their Vercel URL.)
4. Deploy. Every push to a branch creates a **preview** URL; merges to the production branch deploy
   production.

## 3. Test the preview

```bash
npm ci
npm run verify          # menu validation, typecheck, lint, production build, all tests
BASE_URL=https://<preview-url> npx playwright test --project=desktop --project=mobile
```
Then open the preview on a real phone: tap Call, Directions, DoorDash; search the menu; add to list.

## 4. Launch switches

In `config/site.ts`: set the four `approvals` to `true` **only after** the owner signs off, and
`previewMode = false` (this removes `noindex` and opens `robots.txt`). Then:
```bash
NEXT_PUBLIC_SITE_URL=https://<final-domain> npm run check:launch
```
must pass.

## 5. Domain & HTTPS

- The older listing domain `fourseasonschineserestaurantgp.com` has **unverified** ownership. Check
  WHOIS/registrar access with the owner before using it; do not buy or transfer anything without
  authorisation.
- Vercel → Project → **Settings → Domains** → add `example.com` and `www.example.com`. Follow the DNS
  records Vercel shows (A record for apex, CNAME for `www`) at the registrar. HTTPS certificates are
  issued automatically.
- Pick one canonical host (e.g. apex) and redirect the other in the Domains screen.

## 6. Google

- **Search Console:** add the domain property, verify by DNS TXT, submit `https://<domain>/sitemap.xml`.
- **Google Business Profile:** confirm name, address, phone and hours match `config/restaurant.ts`
  exactly; set the website to the new domain; set the menu link to `https://<domain>/menu`; update
  holiday hours there whenever you add `hoursOverrides`.

## 7. Future updates

Edit content (see `MENU_MANAGEMENT.md`) → commit → Vercel builds a preview for branches or deploys
production for the main branch. Roll back from Vercel → Deployments → "Promote" an earlier deployment.

## Security headers

Set in `next.config.ts`: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`. No secrets exist in the codebase; `.env*` is git-ignored.
