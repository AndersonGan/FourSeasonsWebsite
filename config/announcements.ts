/**
 * Announcement strip at the very top of every page.
 * Leave the list empty to hide the strip completely.
 *
 * Each entry shows only between `start` and `end` (restaurant-local dates,
 * inclusive). Omit `start`/`end` to show it until you remove it.
 *
 * Example:
 *   {
 *     id: "xmas-2026",
 *     text: "Closed Christmas Day. Open Dec 26 at noon.",
 *     start: "2026-12-15",
 *     end: "2026-12-26",
 *   },
 */
export interface Announcement {
  id: string;
  text: string;
  href?: string;
  linkLabel?: string;
  start?: string;
  end?: string;
}

export const announcements: Announcement[] = [];
