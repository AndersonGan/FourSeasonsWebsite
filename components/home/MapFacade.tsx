"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { fullAddress, restaurant } from "@/config/restaurant";

/**
 * Click-to-load map. No Google request (or cookies) until the visitor asks
 * for the map, keeping pages fast and private by default.
 */
export function MapFacade({ className = "" }: { className?: string }) {
  const [load, setLoad] = useState(false);
  const q = encodeURIComponent(`Four Seasons Restaurant, ${fullAddress}`);
  return (
    <div className={`relative overflow-hidden border-2 border-ink bg-paper-deep ${className}`}>
      {load ? (
        <iframe
          title={`Map showing ${restaurant.name}, ${fullAddress}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          {/* abstract street grid — decorative, not a map */}
          <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <g stroke="#E9D2A8" strokeWidth="14">
              <path d="M0 70h400M0 160h400M0 240h400M70 0v260M180 0v260M300 0v260" />
            </g>
            <path d="M0 115h400" stroke="#F2BE8A" strokeWidth="18" />
            <g stroke="#7FA66B" strokeWidth="3" opacity=".7">
              <path d="M20 200c40-20 60 30 110 0M330 40c20 20 40 10 60 30" fill="none" />
            </g>
          </svg>
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-red text-paper shadow-[0_4px_0_var(--color-red-deep)]">
            <MapPin className="h-7 w-7" aria-hidden />
          </span>
          <p className="relative font-display text-xl">{restaurant.address.street}</p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setLoad(true)} className="min-h-11 rounded-[3px] border-2 border-ink bg-paper px-4 font-bold hover:bg-ink hover:text-paper">
              Show interactive map
            </button>
            <a href={restaurant.links.directions} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-[3px] bg-bamboo px-4 font-bold text-paper">
              Directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
          <p className="relative text-xs text-ink-soft">The map loads from Google only when you choose to show it.</p>
        </div>
      )}
    </div>
  );
}
