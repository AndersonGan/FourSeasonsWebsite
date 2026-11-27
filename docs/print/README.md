# Printing

## QR stickers for old to-go menus

Old printed menus have outdated prices. These stickers send customers to the
current menu online.

| File | Use |
|---|---|
| `qr-menu-stickers-letter-30up.pdf` | **Print this** on the label sheets (30 per page) |
| `qr-menu-stickers-ALIGNMENT-TEST.pdf` | Same layout with dashed outlines — print on plain paper first |
| `qr-menu-sticker-preview.png` | One sticker, enlarged |
| `qr-menu-code.svg` | The QR code alone (vector) |

**Labels:** 1" × 2-5/8" address labels, 30 per 8.5" × 11" sheet (Avery 5160 /
8160 layout).

**QR code opens:** `https://fourseasonsgp.vercel.app/menu`
(verified by decoding the printed PDF at 300 dpi and at 150 dpi).

### How to print

1. Open the PDF in Adobe Reader or your browser and choose **Print**.
2. Set scale to **Actual size / 100%** — never "Fit to page" or "Shrink oversized pages".
3. Paper: Letter. Margins: None/minimum. Print in color, standard or high quality.
4. First print the **ALIGNMENT-TEST** on plain paper, hold it behind a label
   sheet against a window: the dashed boxes should sit on the labels. If every
   box is shifted the same way, adjust your printer's margin/offset setting.
5. Load one label sheet (check which side your printer prints on) and print
   `qr-menu-stickers-letter-30up.pdf`.
6. Before sticking 900 of them: scan one with a phone and confirm it opens the
   new menu.

### ⚠ Before you print in bulk

The code points at `fourseasonsgp.vercel.app/menu`. That address shows the
**new** site only once the new website is launched (merged into the `main`
branch on GitHub / promoted to production on Vercel). Until then it shows the
old page. Launch first, test one sticker, then print the rest.

To point the stickers somewhere else (e.g. a custom domain you've bought):

```bash
npm run qr:stickers -- https://www.example.com/menu
```

Printed stickers can't be changed later, so keep `fourseasonsgp.vercel.app`
working (Vercel keeps it even after you add a custom domain) or redirect it.

## Full to-go menu

- **Official printed menu (your design):** `public/menu/four-seasons-to-go-menu.pdf`
  — also downloadable from the website's menu page ("Printed menu (PDF)").
- **Print-friendly menu from the website data:** open `/menu/print` on the
  site and click **Print this menu**. Fits on 2 letter pages (one sheet,
  double-sided).
