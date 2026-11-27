/**
 * Four-season theming. The site picks the season from the restaurant-local
 * date (Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter).
 *
 *  - `enabled: false`  → always use `fallback` (seasonal art off).
 *  - `override`        → force one season (e.g. "winter") regardless of date.
 */
export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASONS: readonly Season[] = ["spring", "summer", "autumn", "winter"] as const;

export const seasonConfig = {
  enabled: true,
  override: null as Season | null,
  fallback: "autumn" as Season,
};

export interface SeasonTheme {
  id: Season;
  name: string;
  motif: string;
  /** Short line used in the seasonal showcase. Never names invented dishes. */
  line: string;
  months: string;
}

export const seasonThemes: Record<Season, SeasonTheme> = {
  spring: {
    id: "spring",
    name: "Spring",
    motif: "Plum blossoms",
    line: "Windows open on K Street, and lunch tastes better outside the office.",
    months: "March – May",
  },
  summer: {
    id: "summer",
    name: "Summer",
    motif: "Lotus & sunlight",
    line: "Too hot to cook. Call ahead and take dinner to the river.",
    months: "June – August",
  },
  autumn: {
    id: "autumn",
    name: "Autumn",
    motif: "Harvest moon",
    line: "Rain on the windshield, a warm bag on the passenger seat.",
    months: "September – November",
  },
  winter: {
    id: "winter",
    name: "Winter",
    motif: "Pines & warm steam",
    line: "Soup weather. Egg flower, wonton, and a pot of hot tea.",
    months: "December – February",
  },
};
