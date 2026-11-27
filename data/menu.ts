import raw from "./menu.json";
import type { MenuCategory, MenuData, MenuItem } from "./menu-schema";

export type { MenuCategory, MenuData, MenuItem } from "./menu-schema";

const data = raw as unknown as MenuData;

/** Categories with hidden items removed, in printed order. */
export const menu: MenuData = {
  meta: data.meta,
  categories: [...data.categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      ...c,
      items: c.items.filter((i) => i.approval !== "hidden").sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter((c) => c.items.length > 0),
};

export const allItems: (MenuItem & { categoryId: string; categoryTitle: string })[] = menu.categories.flatMap((c) =>
  c.items.map((i) => ({ ...i, categoryId: c.id, categoryTitle: c.title })),
);

const byId = new Map(allItems.map((i) => [i.id, i]));

export function getItem(id: string) {
  return byId.get(id);
}

/** Look up items by id for editorial sections; silently skips ids that no longer exist. */
export function pickItems(ids: readonly string[]) {
  return ids.map((id) => byId.get(id)).filter((i): i is NonNullable<typeof i> => Boolean(i));
}

export function getCategory(id: string): MenuCategory | undefined {
  return menu.categories.find((c) => c.id === id);
}

export const menuIsApproved = data.meta.approval === "approved";
