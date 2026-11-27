/**
 * Gallery entries. Two kinds:
 *  - "illustration": original artwork rendered from components/illustrations
 *  - "photo": an owner-approved photograph in /public/images (add after the shoot;
 *    see docs/PHOTO_SHOT_LIST.md). Set width/height to the real pixel size.
 *
 * Every photo must have `approved: true` and a `credit` before it appears.
 * The four food photos come from data/photos.ts (restaurant's DoorDash listing).
 */
import { photos, type Photo } from "./photos";

export type IllustrationKey =
  | "marfar"
  | "takeout"
  | "dimsum"
  | "family"
  | "storefront"
  | "spring"
  | "summer"
  | "autumn"
  | "winter";

export type GalleryEntry =
  | { kind: "illustration"; id: string; art: IllustrationKey; title: string; caption: string; bg: string; dark?: boolean }
  | { kind: "photo"; id: string; src: string; width: number; height: number; alt: string; caption: string; credit: string; approved: boolean; cutout?: boolean };

const photoEntry = (id: string, p: Photo, caption: string): GalleryEntry => ({
  kind: "photo",
  id,
  src: p.src,
  width: p.width,
  height: p.height,
  alt: p.alt,
  caption,
  credit: p.credit,
  approved: true,
  cutout: p.cutout,
});

export const gallery: GalleryEntry[] = [
  photoEntry("photo-marfar", photos.marFar, "Mar Far Chicken"),
  photoEntry("photo-orange", photos.orangeChicken, "Orange Chicken"),
  photoEntry("photo-sweet-sour", photos.sweetSour, "Sweet & Sour Chicken"),
  photoEntry("photo-tso", photos.generalTso, "General Tso's Chicken"),
  photoEntry("photo-broccoli", photos.broccoliBeef, "Broccoli Beef"),
  { kind: "illustration", id: "marfar", art: "marfar", title: "Mar Far & pink sauce", caption: "Golden Mar Far chicken with a bowl of pink sauce.", bg: "#EDA9B1" },
  { kind: "illustration", id: "takeout", art: "takeout", title: "The takeout box", caption: "A Four Seasons–red band and seal on a classic folded box.", bg: "#B82025", dark: true },
  { kind: "illustration", id: "dimsum", art: "dimsum", title: "Little bites", caption: "Dumplings and BBQ pork buns in a bamboo steamer.", bg: "#246B54", dark: true },
  { kind: "illustration", id: "family", art: "family", title: "Family style", caption: "Shared plates around the table.", bg: "#F6E3C2" },
  { kind: "illustration", id: "storefront", art: "storefront", title: "On SE K Street", caption: "Red awning and bamboo by the door — an illustrated impression.", bg: "#FFF8EA" },
  { kind: "illustration", id: "spring", art: "spring", title: "Spring", caption: "Plum blossoms.", bg: "#F8DADE" },
  { kind: "illustration", id: "summer", art: "summer", title: "Summer", caption: "Lotus and sunlight.", bg: "#246B54", dark: true },
  { kind: "illustration", id: "autumn", art: "autumn", title: "Autumn", caption: "Harvest moon.", bg: "#F2BE8A" },
  { kind: "illustration", id: "winter", art: "winter", title: "Winter", caption: "Pines and warm steam.", bg: "#263A4F", dark: true },
];

export const visibleGallery = gallery.filter((g) => g.kind === "illustration" || g.approved);
export const hasApprovedPhotos = gallery.some((g) => g.kind === "photo" && g.approved);
