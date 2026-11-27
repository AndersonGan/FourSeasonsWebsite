"use client";

import { useEffect, useState } from "react";
import { SEASONS, seasonThemes, type Season } from "@/config/seasons";
import { SEASON_ART, SEASON_PANEL_BG } from "./SeasonalArt";
import { currentSeason } from "@/lib/season";

const darkPanels: Season[] = ["summer", "winter"];

/**
 * Four illustrated "stamps". Choosing one previews that season's accent
 * across the page (sets html[data-season]); "Back to today" restores it.
 */
export function SeasonShowcase() {
  const [today, setToday] = useState<Season | null>(null);
  const [preview, setPreview] = useState<Season | null>(null);

  useEffect(() => {
    const s = (document.documentElement.dataset.season as Season | undefined) ?? currentSeason();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read season set by the pre-paint boot script
    setToday(s);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (preview) root.dataset.season = preview;
    else if (today) root.dataset.season = today;
  }, [preview, today]);

  useEffect(() => () => {
    if (today) document.documentElement.dataset.season = today;
  }, [today]);

  const active = preview ?? today;

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {SEASONS.map((s) => {
          const t = seasonThemes[s];
          const Art = SEASON_ART[s];
          const dark = darkPanels.includes(s);
          const isActive = active === s;
          return (
            <li key={s}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setPreview(s === today ? null : s)}
                className={`group relative flex aspect-[3/4] w-full flex-col overflow-hidden p-3 text-left transition-transform duration-300 hover:-translate-y-1 ${dark ? "text-paper on-dark" : "text-ink"} ${isActive ? "ring-4 ring-ink ring-offset-4 ring-offset-paper" : ""}`}
                style={{ backgroundColor: SEASON_PANEL_BG[s] }}
              >
                <span className="pointer-events-none absolute inset-2 border-2 border-current opacity-40" aria-hidden />
                <span className="relative mx-auto mt-2 block h-[62%] w-[86%]">
                  <Art className="h-full w-full" />
                </span>
                <span className="relative mt-auto px-2 pb-2">
                  <span className="block font-display text-xl font-semibold uppercase tracking-wide sm:text-2xl">{t.name}</span>
                  <span className="block text-xs font-bold sm:text-sm">{t.motif}</span>
                  {s === today ? <span className="mt-1 inline-block bg-ink px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-paper">Now</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex min-h-16 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
        <p className="max-w-xl font-display text-xl italic leading-snug sm:text-2xl">
          {active ? seasonThemes[active].line : seasonThemes.autumn.line}
        </p>
        {preview ? (
          <button type="button" onClick={() => setPreview(null)} className="shrink-0 font-bold underline decoration-2 underline-offset-4 hover:text-red">
            Back to today&rsquo;s season
          </button>
        ) : null}
      </div>
    </div>
  );
}
