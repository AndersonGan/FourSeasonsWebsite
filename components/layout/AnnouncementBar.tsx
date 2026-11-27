"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { announcements, type Announcement } from "@/config/announcements";
import { localParts } from "@/lib/business-hours";

function isActive(a: Announcement, today: string) {
  return (!a.start || a.start <= today) && (!a.end || a.end >= today);
}

const subscribe = () => () => {};

/** Top strip for closures and updates. Renders nothing when there is nothing to say. */
export function AnnouncementBar() {
  // Server render: undated announcements only. Client: date-filtered in restaurant time.
  const today = useSyncExternalStore(subscribe, () => localParts(new Date()).date, () => null);
  const active = announcements.filter((a) => (today ? isActive(a, today) : !a.start && !a.end));
  if (active.length === 0) return null;
  return (
    <div data-announcement className="bg-ink text-paper on-dark">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-semibold sm:px-6">
        {active.map((a) => (
          <p key={a.id}>
            {a.text}
            {a.href ? (
              <>
                {" "}
                <Link href={a.href} className="underline decoration-amber decoration-2">
                  {a.linkLabel ?? "Details"}
                </Link>
              </>
            ) : null}
          </p>
        ))}
      </div>
    </div>
  );
}
