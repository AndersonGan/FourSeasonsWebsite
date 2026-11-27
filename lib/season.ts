import { seasonConfig, type Season } from "@/config/seasons";
import { restaurant } from "@/config/restaurant";

/** Meteorological season for a month number (1–12). */
export function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

/** Season at the restaurant (America/Los_Angeles), honoring override/disable switches. */
export function currentSeason(now: Date = new Date(), cfg = seasonConfig, timeZone: string = restaurant.timeZone): Season {
  if (!cfg.enabled) return cfg.fallback;
  if (cfg.override) return cfg.override;
  const month = Number(new Intl.DateTimeFormat("en-US", { timeZone, month: "numeric" }).format(now));
  return seasonForMonth(month);
}

/**
 * Inline script placed in <head>. Sets data-season on <html> before first
 * paint so seasonal art never flashes or shifts layout, and never causes a
 * hydration mismatch (React does not manage this attribute).
 */
export function seasonBootScript(): string {
  const cfg = JSON.stringify({ e: seasonConfig.enabled, o: seasonConfig.override, f: seasonConfig.fallback, tz: restaurant.timeZone });
  return `(function(){try{var c=${cfg};var s=c.f;if(c.e){if(c.o){s=c.o}else{var m=+new Intl.DateTimeFormat("en-US",{timeZone:c.tz,month:"numeric"}).format(new Date());s=m>=3&&m<=5?"spring":m>=6&&m<=8?"summer":m>=9&&m<=11?"autumn":"winter"}}document.documentElement.dataset.season=s;}catch(e){}})();`;
}
