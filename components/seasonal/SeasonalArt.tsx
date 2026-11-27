import type { Season } from "@/config/seasons";
import { HarvestMoon, Lotus, PlumBranch, WinterPines } from "@/components/illustrations/Botanical";

export const SEASON_ART: Record<Season, (p: { className?: string }) => React.ReactNode> = {
  spring: PlumBranch,
  summer: Lotus,
  autumn: HarvestMoon,
  winter: WinterPines,
};

export const SEASON_PANEL_BG: Record<Season, string> = {
  spring: "#F8DADE",
  summer: "#246B54",
  autumn: "#F2BE8A",
  winter: "#263A4F",
};

/**
 * Renders all four seasonal artworks; CSS shows only the one matching
 * <html data-season>. Static, crawl-safe and free of hydration mismatch.
 */
export function SeasonalArt({ className }: { className?: string }) {
  return (
    <div className={`season-art ${className ?? ""}`} aria-hidden>
      {(Object.keys(SEASON_ART) as Season[]).map((s) => {
        const Art = SEASON_ART[s];
        return (
          <div key={s} data-season-art={s} className="h-full w-full">
            <Art className="h-full w-full" />
          </div>
        );
      })}
    </div>
  );
}

export function SeasonName() {
  return (
    <span className="season-label">
      {(["spring", "summer", "autumn", "winter"] as const).map((s) => (
        <span key={s} data-season-label={s}>
          {s}
        </span>
      ))}
    </span>
  );
}
