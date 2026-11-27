/**
 * Food photography used on the site. One entry per file in /public/images.
 *
 * Source: the restaurant's own DoorDash store listing (merchant-provided photos),
 * imported November 2026 at the owner's request. Replace with photos from the
 * planned shoot (docs/PHOTO_SHOT_LIST.md) when available.
 *
 * `cutout: true` = background removed, so the plate sits directly on the page.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Menu item id this photo shows (data/menu.json). */
  itemId?: string;
  cutout: boolean;
  credit: string;
}

const CREDIT = "Four Seasons Restaurant (DoorDash store photo)";

export const photos = {
  orangeChicken: {
    src: "/images/menu/orange-chicken.webp",
    width: 1193,
    height: 1117,
    alt: "Orange Chicken from Four Seasons: glossy, crispy chicken pieces piled on a square white plate",
    itemId: "orange-chicken",
    cutout: true,
    credit: CREDIT,
  },
  generalTso: {
    src: "/images/menu/general-tsos-chicken.webp",
    width: 1200,
    height: 782,
    alt: "General Tso's Chicken from Four Seasons: crispy chicken in a shiny amber sauce on a white plate",
    itemId: "general-tsos-chicken",
    cutout: true,
    credit: CREDIT,
  },
  broccoliBeef: {
    src: "/images/menu/broccoli-beef.webp",
    width: 1087,
    height: 847,
    alt: "Broccoli Beef from Four Seasons: sliced beef and bright green broccoli in brown sauce",
    itemId: "broccoli-beef",
    cutout: true,
    credit: CREDIT,
  },
  sweetSour: {
    src: "/images/menu/sweet-and-sour-chicken.webp",
    width: 1422,
    height: 800,
    alt: "Sweet & Sour Chicken from Four Seasons: battered chicken with red sweet and sour sauce, served on a table in the restaurant",
    itemId: "sweet-and-sour-chicken",
    cutout: false,
    credit: CREDIT,
  },
} satisfies Record<string, Photo>;

export const photoByItem: Record<string, Photo> = Object.fromEntries(
  Object.values(photos)
    .filter((p): p is Photo & { itemId: string } => Boolean(p.itemId))
    .map((p) => [p.itemId, p]),
);
