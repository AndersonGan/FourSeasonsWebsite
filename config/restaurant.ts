/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FOUR SEASONS RESTAURANT — BUSINESS SETTINGS
 *  This is the one place to change the restaurant's name, address, phone,
 *  hours, holiday closures, ordering links and review snapshots.
 *  See docs/MENU_MANAGEMENT.md ("Everyday edits") for plain-English steps.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

/** "HH:MM" in 24-hour restaurant-local time (America/Los_Angeles). */
export type Clock = `${number}:${number}`;

export interface Interval {
  open: Clock;
  close: Clock;
}

export interface HoursOverride {
  /** Restaurant-local calendar date, YYYY-MM-DD. */
  date: string;
  /** Leave empty ([]) to mark the restaurant closed that day. */
  intervals: Interval[];
  /** Shown to customers, e.g. "Closed for Thanksgiving". */
  label: string;
}

export interface RatingSnapshot {
  platform: string;
  url: string;
  rating: number;
  outOf: number;
  /** Text like "200+" exactly as the platform displayed it. */
  count: string;
  /** When the number was read from the platform. */
  checked: string;
}

export const restaurant = {
  name: "Four Seasons Restaurant",
  shortName: "Four Seasons",
  /**
   * Chinese name. NOT VERIFIED — keep `chineseNameApproved` false until the
   * owner confirms the characters on the actual signage.
   */
  chineseName: "四季",
  chineseNameApproved: false,

  tagline: "Four Seasons. Endless Flavor.",
  description:
    "A neighborhood Chinese-American kitchen on SE K Street in downtown Grants Pass, Oregon — dine-in, takeout and delivery.",

  address: {
    street: "122 SE K Street",
    streetShort: "122 SE K St",
    city: "Grants Pass",
    region: "OR",
    regionName: "Oregon",
    postalCode: "97526",
    country: "US",
  },
  /** Approximate; used only for search-engine data. Owner: confirm on Google Maps. */
  geo: { latitude: 42.4379, longitude: -123.3262 },

  phone: {
    display: "(541) 479-6532",
    tel: "+15414796532",
  },

  timeZone: "America/Los_Angeles",

  /** Ordinary weekly hours. An empty list means closed all day. */
  hours: {
    sun: [],
    mon: [],
    tue: [{ open: "12:00", close: "21:00" }],
    wed: [{ open: "12:00", close: "21:00" }],
    thu: [{ open: "12:00", close: "21:00" }],
    fri: [{ open: "12:00", close: "21:00" }],
    sat: [{ open: "12:00", close: "21:00" }],
  } satisfies Record<DayKey, Interval[]>,

  /**
   * Holiday or temporary changes. Example:
   *   { date: "2026-12-25", intervals: [], label: "Closed for Christmas" },
   *   { date: "2026-12-24", intervals: [{ open: "12:00", close: "17:00" }], label: "Christmas Eve — closing early" },
   */
  hoursOverrides: [] as HoursOverride[],

  /**
   * Set to false to hide the live "Open now / Closed" badge everywhere
   * (for example if hours are uncertain this week). The published schedule
   * still shows.
   */
  showLiveOpenStatus: true,

  /** Lunch specials window, as printed on the menu. */
  lunchWindow: { start: "12:00" as Clock, end: "16:00" as Clock, label: "Noon – 4 PM" },

  services: ["Dine-in", "Takeout", "Delivery via DoorDash"],

  links: {
    doordash: "https://www.doordash.com/store/four-seasons-restaurant-grants-pass-37535244/",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Four+Seasons+Restaurant%2C+122+SE+K+St%2C+Grants+Pass%2C+OR+97526",
    mapSearch:
      "https://www.google.com/maps/search/?api=1&query=Four+Seasons+Restaurant%2C+122+SE+K+St%2C+Grants+Pass%2C+OR+97526",
    /** Add only after the owner confirms the page is theirs. */
    facebook: null as string | null,
    googleReviews: null as string | null,
  },

  /** History statements that public records support. Do not embellish. */
  history: {
    sinceYear: 2011,
    statement: "Part of the Grants Pass dining community since at least 2011.",
  },

  /**
   * Third-party ratings snapshot. Shown only when `showRatings` is true.
   * Always identify the platform and the date the figure was read.
   */
  showRatings: false,
  ratings: [
    {
      platform: "DoorDash",
      url: "https://www.doordash.com/store/four-seasons-restaurant-grants-pass-37535244/",
      rating: 4.8,
      outOf: 5,
      count: "200+",
      checked: "November 2026",
    },
    {
      platform: "Restaurantji",
      url: "https://www.restaurantji.com/or/grants-pass/four-seasons-restaurant-/",
      rating: 4.2,
      outOf: 5,
      count: "191",
      checked: "November 2026",
    },
  ] as RatingSnapshot[],

  /** Local recognition supported by public sources (see docs/BUSINESS_RESEARCH.md). */
  recognition: [
    { year: "2011", text: "Listed among new restaurants in Sneak Preview's Best of Grants Pass", source: "https://sneakpre.com/best-of/best-of-grants-pass-2011/" },
    { year: "2012", text: "Named among six reader-favored Asian restaurants in Sneak Preview's Best of Grants Pass", source: "https://sneakpre.com/best-of/best-of-grants-pass-2012/" },
    { year: "2013", text: "Listed among Asian restaurant favorites in Sneak Preview's Best of Grants Pass", source: "https://sneakpre.com/best-of/best-of-grants-pass-2013/" },
    { year: "2020–24", text: "Nextdoor Neighborhood Favorite (as reported on Nextdoor)", source: "https://nextdoor.com/pages/four-seasons-grants-pass-or/" },
  ],
  /** Owner must approve before recognition appears on the site. */
  showRecognition: true,
} as const;

/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is
 * connected (e.g. https://fourseasonsgrantspass.com). Falls back to the Vercel
 * preview URL, then localhost.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.region} ${restaurant.address.postalCode}`;
