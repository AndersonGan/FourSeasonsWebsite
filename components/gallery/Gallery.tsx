"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryEntry, IllustrationKey } from "@/data/gallery";
import { DimSumSteamer, FamilyTable, MarFarPlate, TakeoutBox } from "@/components/illustrations/Food";
import { HarvestMoon, Lotus, PlumBranch, WinterPines } from "@/components/illustrations/Botanical";
import { Storefront } from "@/components/illustrations/Storefront";

const ART: Record<IllustrationKey, (p: { className?: string }) => React.ReactNode> = {
  marfar: MarFarPlate,
  takeout: TakeoutBox,
  dimsum: DimSumSteamer,
  family: FamilyTable,
  storefront: Storefront,
  spring: PlumBranch,
  summer: Lotus,
  autumn: HarvestMoon,
  winter: WinterPines,
};

function Visual({ entry, large = false }: { entry: GalleryEntry; large?: boolean }) {
  if (entry.kind === "photo") {
    if (entry.cutout) {
      return (
        <div className={`flex items-center justify-center bg-paper-deep ${large ? "max-h-[78vh] w-[min(90vw,1100px)] p-6" : "h-full w-full p-5"}`}>
          <Image
            src={entry.src}
            width={entry.width}
            height={entry.height}
            alt={entry.alt}
            sizes={large ? "90vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={`${large ? "max-h-[70vh]" : "max-h-full"} h-auto w-auto max-w-full object-contain drop-shadow-[0_14px_18px_rgba(36,33,29,.22)]`}
          />
        </div>
      );
    }
    return (
      <Image
        src={entry.src}
        width={entry.width}
        height={entry.height}
        alt={entry.alt}
        sizes={large ? "100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className={large ? "max-h-[78vh] w-auto object-contain" : "h-full w-full object-cover"}
      />
    );
  }
  const Art = ART[entry.art];
  return (
    <div className={`flex items-center justify-center ${large ? "aspect-square w-[min(78vh,90vw)] p-10" : "h-full w-full p-8"}`} style={{ backgroundColor: entry.bg }}>
      <Art className="h-full w-full" />
    </div>
  );
}

/** Editorial grid + accessible lightbox (keyboard, Escape, focus return, swipe). */
export function Gallery({ entries }: { entries: GalleryEntry[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback((delta: number) => setIndex((i) => (i === null ? i : (i + delta + entries.length) % entries.length)), [entries.length]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const current = index !== null ? entries[index] : null;
  const layout = ["sm:col-span-2 sm:row-span-2", "", "", "sm:row-span-2", "", "", "", "sm:col-span-2", ""];

  return (
    <>
      <ul className="grid auto-rows-[minmax(14rem,auto)] gap-3 sm:grid-flow-dense sm:grid-cols-3 sm:gap-4">
        {entries.map((e, i) => (
          <li key={e.id} className={`${layout[i % layout.length]} min-h-56`}>
            <button
              type="button"
              className="group relative block h-full w-full overflow-hidden text-left"
              onClick={(ev) => {
                openerRef.current = ev.currentTarget;
                setIndex(i);
              }}
            >
              <span className="sr-only">View larger: </span>
              <span className="block h-full w-full transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.03]">
                <Visual entry={e} />
              </span>
              <span className={`absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/45 to-transparent p-4 pt-10 text-paper`}>
                <span className="font-display text-xl">{e.kind === "photo" ? e.caption : e.title}</span>
                {e.kind === "illustration" ? <span className="sr-only"> (illustration)</span> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current ? (current.kind === "photo" ? current.alt : current.title) : "Gallery"}
        onClose={() => {
          setIndex(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => e.target === dialogRef.current && setIndex(null)}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/90"
      >
        {current ? (
          <figure className="flex flex-col items-center gap-3 p-4">
            <Visual entry={current} large />
            <figcaption className="max-w-xl text-center text-paper">
              <span className="font-display text-2xl">{current.kind === "photo" ? current.caption : current.title}</span>
              <span className="block text-paper/80">{current.kind === "photo" ? current.credit : `${current.caption} Original illustration.`}</span>
              <span className="mt-1 block text-sm text-paper/60">
                {index! + 1} of {entries.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
        <button type="button" onClick={() => setIndex(null)} className="fixed right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink" aria-label="Close">
          <X className="h-6 w-6" aria-hidden />
        </button>
        <button type="button" onClick={() => go(-1)} className="fixed left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink" aria-label="Previous image">
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        <button type="button" onClick={() => go(1)} className="fixed right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink" aria-label="Next image">
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>
      </dialog>
    </>
  );
}
