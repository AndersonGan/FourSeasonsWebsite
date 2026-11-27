"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Plays CSS entrance animations inside it once it scrolls into view.
 * Server HTML shows the finished artwork; animation is progressive
 * enhancement (skipped for reduced motion, no-JS, or if already played).
 */
export function AnimateOnView({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("anim-armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("anim-play");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
