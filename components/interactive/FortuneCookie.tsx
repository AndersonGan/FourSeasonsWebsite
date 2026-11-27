"use client";

import { useState } from "react";
import { fortunes, luckyNumbers } from "@/data/fortunes";

/** Tap-to-open digital fortune cookie. Optional fun; never blocks anything. */
export function FortuneCookie({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const opened = index !== null;

  const crack = () => {
    let next = Math.floor(Math.random() * fortunes.length);
    if (next === index) next = (next + 1) % fortunes.length;
    setIndex(next);
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <button
        type="button"
        onClick={crack}
        className="group relative block h-40 w-60 rounded-md focus-visible:outline-offset-8"
        aria-describedby="fortune-text"
      >
        <span className="sr-only">{opened ? "Open another fortune cookie" : "Open the fortune cookie"}</span>
        <svg viewBox="0 0 240 160" className="h-full w-full overflow-visible" aria-hidden>
          {/* paper slip */}
          <g className={`transition-all duration-500 ease-[var(--ease-soft)] ${opened ? "opacity-100" : "opacity-0"}`} style={{ transform: opened ? "translateY(-18px)" : "translateY(10px)" }}>
            <rect x="46" y="62" width="148" height="26" fill="#FFF8EA" stroke="#B82025" strokeWidth="1.6" transform="rotate(-4 120 75)" />
            <text x="120" y="80" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fontWeight="700" fill="#B82025" transform="rotate(-4 120 75)" letterSpacing="2">
              GOOD FORTUNE
            </text>
          </g>
          {/* left half */}
          <g className="transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-rotate-3" style={{ transformOrigin: "120px 120px", transform: opened ? "translate(-26px, 10px) rotate(-18deg)" : undefined }}>
            <path d="M120 70C88 64 52 82 44 116c22 14 54 16 76 8Z" fill="#E8B64B" stroke="#9A5A1C" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M120 82c-20 2-42 14-54 30" stroke="#C9862E" strokeWidth="2" fill="none" />
          </g>
          {/* right half */}
          <g className="transition-transform duration-500 ease-[var(--ease-soft)] group-hover:rotate-3" style={{ transformOrigin: "120px 120px", transform: opened ? "translate(26px, 10px) rotate(18deg)" : undefined }}>
            <path d="M120 70c32-6 68 12 76 46-22 14-54 16-76 8Z" fill="#E8B64B" stroke="#9A5A1C" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M120 82c20 2 42 14 54 30" stroke="#C9862E" strokeWidth="2" fill="none" />
          </g>
        </svg>
      </button>
      <div className="mt-2 min-h-[5.5rem] max-w-xs" aria-live="polite" id="fortune-text">
        {opened ? (
          <>
            <p className="font-display text-xl italic leading-snug">“{fortunes[index]}”</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] opacity-75">Lucky numbers {luckyNumbers(index + 3).join(" · ")}</p>
          </>
        ) : (
          <p className="text-sm font-semibold opacity-85">Tap the cookie for a fortune.</p>
        )}
      </div>
    </div>
  );
}
