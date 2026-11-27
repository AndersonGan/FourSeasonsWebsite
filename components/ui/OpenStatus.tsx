"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/config/restaurant";
import { describeStatus, getOpenStatus, type OpenStatus as Status } from "@/lib/business-hours";

/**
 * Live open/closed badge. Server HTML shows the published schedule text
 * (`fallback`); after mount, the client swaps in live status computed in
 * restaurant-local time. The box keeps the same size to avoid layout shift.
 */
export function OpenStatus({ fallback, className = "", tone = "light" }: { fallback: string; className?: string; tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (!restaurant.showLiveOpenStatus) return;
    const tick = () => setStatus(getOpenStatus(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const open = status?.state === "open";
  const dot = status ? (open ? (status.closingSoon ? "bg-amber" : "bg-[#3fae6a]") : "bg-red") : "bg-ink-soft/40";
  const text = status ? describeStatus(status) : fallback;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} data-testid="open-status" data-state={status?.state ?? "schedule"}>
      <span aria-hidden className={`relative inline-block h-2.5 w-2.5 rounded-full ${dot} ${tone === "dark" ? "ring-2 ring-paper/30" : "ring-2 ring-white/70"}`} />
      <span aria-live="polite">{text}</span>
      {status?.note ? <span className="opacity-80">· {status.note}</span> : null}
    </span>
  );
}
