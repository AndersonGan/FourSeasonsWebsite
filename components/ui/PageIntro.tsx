import type { ReactNode } from "react";
import { SeasonalArt } from "@/components/seasonal/SeasonalArt";

export function PageIntro({ eyebrow, title, children, art = true }: { eyebrow: string; title: ReactNode; children?: ReactNode; art?: boolean }) {
  return (
    <header className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-20">
      <div className="max-w-3xl">
        <p className="eyebrow text-bamboo">{eyebrow}</p>
        <h1 className="mt-4 text-[clamp(2.9rem,8vw,5.75rem)] font-semibold leading-[0.95]">{title}</h1>
        {children ? <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft">{children}</p> : null}
      </div>
      {art ? (
        <div className="pointer-events-none absolute right-6 top-12 hidden h-52 w-52 rounded-full bg-[var(--season-wash)] p-8 lg:block" aria-hidden>
          <SeasonalArt className="h-full w-full" />
        </div>
      ) : null}
    </header>
  );
}
