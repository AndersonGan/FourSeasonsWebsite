import { expect, test } from "@playwright/test";
import menuJson from "@/data/menu.json";
import { validateMenu } from "@/data/menu-schema";
import { allItems } from "@/data/menu";
import { searchMenu, normalize } from "@/lib/menu-search";
import { currentSeason, seasonForMonth } from "@/lib/season";
import { formatCents, priceText } from "@/lib/format";
import { restaurant } from "@/config/restaurant";

test.describe("menu data", () => {
  test("validates with zero errors", () => {
    const errors = validateMenu(menuJson).filter((i) => i.level === "error");
    expect(errors).toEqual([]);
  });

  test("schema catches duplicate ids, bad prices and double pricing", () => {
    const bad = structuredClone(menuJson) as typeof menuJson;
    const items = bad.categories[0]!.items as Record<string, unknown>[];
    items[1]!.id = items[0]!.id as string;
    items[2]!.priceCents = 10.75;
    items[3]!.variants = [{ label: "Large", priceCents: 1200 }];
    const msgs = validateMenu(bad).filter((i) => i.level === "error").map((i) => i.message);
    expect(msgs.some((m) => m.startsWith("Duplicate item id"))).toBe(true);
    expect(msgs.some((m) => m.startsWith("Invalid price"))).toBe(true);
    expect(msgs.some((m) => m.includes("not both"))).toBe(true);
  });

  test("no dietary claims are published without confirmation", () => {
    expect(allItems.every((i) => i.dietary.length === 0)).toBe(true);
  });

  test("prices are integer cents", () => {
    for (const i of allItems) {
      for (const p of [i.priceCents, ...(i.variants?.map((v) => v.priceCents) ?? [])]) {
        if (p !== undefined) expect(Number.isInteger(p)).toBe(true);
      }
    }
  });
});

test.describe("menu search", () => {
  test("by item number", () => {
    expect(searchMenu(allItems, "no 4").map((i) => i.name)).toEqual(["Dinner Combo No. 4"]);
    expect(searchMenu(allItems, "#7")[0]?.name).toBe("Dinner Combo No. 7");
    expect(searchMenu(allItems, "8")[0]?.name).toBe("Dinner Combo No. 8");
  });
  test("by name with punctuation and alternate spellings", () => {
    expect(searchMenu(allItems, "tsos").some((i) => i.id === "general-tsos-chicken")).toBe(true);
    expect(searchMenu(allItems, "general tao").some((i) => i.id === "general-tsos-chicken")).toBe(true);
    expect(searchMenu(allItems, "szechuan").some((i) => i.name.includes("Szechwan"))).toBe(true);
    expect(searchMenu(allItems, "mar far")[0]?.id).toBe("mar-far-chicken");
    expect(searchMenu(allItems, "sauteed").length).toBeGreaterThan(0);
  });
  test("no results for nonsense", () => {
    expect(searchMenu(allItems, "pizza")).toEqual([]);
  });
  test("normalize", () => {
    expect(normalize("Sautéed Pea-Pods & Tofu")).toBe("sauteed pea pods and tofu");
  });
});

test.describe("seasons", () => {
  test("month mapping", () => {
    expect([1, 2, 3, 5, 6, 8, 9, 11, 12].map(seasonForMonth)).toEqual(["winter", "winter", "spring", "spring", "summer", "summer", "autumn", "autumn", "winter"]);
  });
  test("uses restaurant-local date at month boundaries", () => {
    // 2026-12-01T05:00Z is still Nov 30 in Grants Pass → autumn
    expect(currentSeason(new Date("2026-12-01T05:00:00Z"))).toBe("autumn");
    expect(currentSeason(new Date("2026-12-01T09:00:00Z"))).toBe("winter");
  });
  test("override and disable switches", () => {
    expect(currentSeason(new Date("2026-07-01T12:00:00Z"), { enabled: true, override: "winter", fallback: "autumn" })).toBe("winter");
    expect(currentSeason(new Date("2026-07-01T12:00:00Z"), { enabled: false, override: "spring", fallback: "autumn" })).toBe("autumn");
  });
});

test("formatting", () => {
  expect(formatCents(1075)).toBe("$10.75");
  expect(formatCents(450)).toBe("$4.50");
  expect(priceText({ ...allItems.find((i) => i.id === "egg-flower-soup")! })).toBe("Cup $4.00, Small $5.00, Large $7.50");
});

test("business info matches research seed", () => {
  expect(restaurant.phone.tel).toBe("+15414796532");
  expect(restaurant.address.street).toBe("122 SE K Street");
  expect(restaurant.links.doordash).toBe("https://www.doordash.com/store/four-seasons-restaurant-grants-pass-37535244/");
});
