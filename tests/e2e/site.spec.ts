import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/menu", "/menu/print", "/about", "/gallery", "/visit", "/order", "/privacy"];
const DOORDASH = "https://www.doordash.com/store/four-seasons-restaurant-grants-pass-37535244/";

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("every route", () => {
  for (const route of ROUTES) {
    test(`${route} renders, one h1, no console/hydration errors, no overflow, no axe violations`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const axe = await new AxeBuilder({ page } as unknown as ConstructorParameters<typeof AxeBuilder>[0]).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  test("unknown route is a 404 with navigation back", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "See the menu" })).toBeVisible();
  });
});

test("business info and outbound links are correct", async ({ page }) => {
  await page.goto("/");
  const tel = page.locator('a[href="tel:+15414796532"]');
  expect(await tel.count()).toBeGreaterThan(2);
  await expect(page.locator(`a[href="${DOORDASH}"]`).first()).toHaveAttribute("rel", /noopener/);
  await expect(page.locator('a[href^="https://www.google.com/maps/dir/"]').first()).toBeAttached();
  await expect(page.getByText("122 SE K Street").first()).toBeVisible();
  // JSON-LD
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
  expect(ld["@type"]).toBe("Restaurant");
  expect(ld.telephone).toBe("+15414796532");
  expect(ld.aggregateRating).toBeUndefined();
});

test("open status shows live text after hydration (restaurant-local time)", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-12-01T20:30:00Z")); // Tue 12:30 PST; browser is in New York
  await page.goto("/");
  await expect(page.getByTestId("open-status").first()).toHaveText(/Open now · until 9 PM/);
  await page.clock.setFixedTime(new Date("2026-12-08T00:00:00Z")); // Mon 16:00 PST
  await page.reload();
  await expect(page.getByTestId("open-status").first()).toHaveText(/Closed · opens tomorrow at noon/);
});

test("navigation works on this viewport", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Our Story" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#mobile-nav")).toBeHidden();
    // Sticky action bar must not cover the footer's last line
    const bar = page.locator("[data-mobile-bar]");
    await expect(bar).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footerBottom = await page.locator("footer[data-site-footer]").evaluate((f) => f.getBoundingClientRect().bottom);
    const barTop = await bar.evaluate((b) => b.getBoundingClientRect().top);
    expect(footerBottom).toBeLessThanOrEqual(barTop + 2);
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Gallery" }).click();
    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
  }
});

test.describe("menu", () => {
  test("search by name and by item number, with empty state", async ({ page }) => {
    await page.goto("/menu");
    const search = page.getByTestId("menu-search");
    await search.fill("orange chicken");
    await expect(page.locator("#orange-chicken")).toBeVisible();
    await expect(page.locator("#broccoli-beef")).toBeHidden();
    await search.fill("L3");
    await expect(page.locator("#lunch-l3")).toBeVisible();
    await expect(page.getByTestId("result-count")).toHaveText("1 dish");
    await search.fill("pizza");
    await expect(page.getByTestId("no-results")).toBeVisible();
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.locator("#broccoli-beef")).toBeAttached();
  });

  test("full menu is in the server HTML (crawlable)", async ({ request }) => {
    const html = await (await request.get("/menu")).text();
    for (const s of ["Mar Far Chicken", "Moo Goo Gai Pan", "Family Dinner Style C", "$17.00", "Hong Kong Chow Mai"]) expect(html).toContain(s);
  });

  test("category navigation jumps to a section", async ({ page, isMobile }) => {
    await page.goto("/menu");
    const nav = page.getByRole("navigation", { name: "Menu sections" }).filter({ visible: true });
    await nav.getByRole("link", { name: "Fried Rice" }).click();
    await expect(page).toHaveURL(/#cat-fried-rice$/);
    await expect(page.locator("#h-fried-rice")).toBeInViewport();
    if (!isMobile) await expect(nav.getByRole("link", { name: "Fried Rice" })).toHaveAttribute("aria-current", "true", { timeout: 4000 });
  });

  test("takeout list: add, variant, subtotal, persist, explicitly not an order", async ({ page }) => {
    const sent: string[] = [];
    page.on("request", (r) => {
      const u = new URL(r.url());
      // Next.js page prefetches (GET /_next, ?_rsc) are fine; anything else would mean data leaves the browser.
      if (r.method() !== "GET" || !(u.pathname.startsWith("/_next") || u.searchParams.has("_rsc") || r.resourceType() === "document")) sent.push(`${r.method()} ${r.url()}`);
    });
    await page.goto("/menu");
    await page.getByRole("button", { name: "Add Crab Puffs to my takeout list" }).click();
    await page.getByRole("button", { name: "Add Crab Puffs to my takeout list" }).click();
    await page.getByRole("button", { name: "Add Egg Flower Soup, Large to my takeout list" }).click();
    await page.getByTestId("open-list").click();
    const dialog = page.getByRole("dialog", { name: "My takeout list" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("not an order")).toBeVisible();
    await expect(page.getByTestId("takeout-subtotal")).toHaveText("$29.50"); // 2×10.75 + 8.00
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.reload();
    await page.getByTestId("open-list").click();
    await expect(page.getByTestId("takeout-subtotal")).toHaveText("$29.50");
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.getByTestId("takeout-subtotal")).toHaveText("$0.00");
    // Nothing about the list is sent anywhere
    expect(sent.filter((s) => !s.includes("fonts") && !s.endsWith(".svg"))).toEqual([]);
  });

  test("family dinners respect the 2-person minimum", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: "Add Family Dinner Style A to my takeout list" }).click();
    await page.getByTestId("open-list").click();
    await expect(page.getByTestId("takeout-subtotal")).toHaveText("$37.00");
  });

  test("price note and allergy guidance are visible", async ({ page }) => {
    await page.goto("/menu");
    await expect(page.getByTestId("price-note")).toContainText("as of July 2026");
    await expect(page.getByText("Food allergies?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Print-friendly menu" }).first()).toHaveAttribute("href", "/menu/print");
  });
});

test("seasonal preview changes the page theme and can be reset", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const initial = await html.getAttribute("data-season");
  expect(["spring", "summer", "autumn", "winter"]).toContain(initial);
  const other = initial === "summer" ? "Winter" : "Summer";
  await page.getByRole("button", { name: new RegExp(`^${other}`) }).click();
  await expect(html).toHaveAttribute("data-season", other.toLowerCase());
  await page.getByRole("button", { name: "Back to today’s season" }).click();
  await expect(html).toHaveAttribute("data-season", initial!);
});

test("fortune cookie opens to a fortune", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open the fortune cookie" }).click();
  await expect(page.locator("#fortune-text")).toContainText("Lucky numbers");
});

test("gallery lightbox: keyboard, Escape and focus return", async ({ page }) => {
  await page.goto("/gallery");
  const first = page.getByRole("button", { name: /View larger: Mar Far/ });
  await first.click();
  const dlg = page.getByRole("dialog");
  await expect(dlg).toBeVisible();
  await expect(dlg).toContainText("1 of");
  await page.keyboard.press("ArrowRight");
  await expect(dlg).toContainText("2 of");
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
  await expect(first).toBeFocused();
});

test("reduced motion still renders everything", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const dur = await page.locator(".steam path").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(dur).toBe("none");
});

test("no horizontal overflow at 320px", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await ctx.newPage();
  for (const r of ["/", "/menu", "/visit", "/order"]) {
    await page.goto(r);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), r).toBeLessThanOrEqual(0);
  }
  await ctx.close();
});

test("SEO basics", async ({ request }) => {
  const home = await (await request.get("/")).text();
  expect(home).toContain("<title>Four Seasons Restaurant | Chinese Food &amp; Takeout in Grants Pass, OR</title>");
  expect(home).toContain('rel="canonical"');
  const menu = await (await request.get("/menu")).text();
  expect(menu).toContain("<title>To-Go Menu | Four Seasons Restaurant Grants Pass</title>");
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).headers()["content-type"]).toContain("image/png");
});
