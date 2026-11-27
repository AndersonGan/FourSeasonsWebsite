"use client";

import { useRef } from "react";
import { Download, Expand, Printer } from "lucide-react";
import Link from "next/link";

/**
 * Shows the owner's original printed menu (PDF) with download, full-screen
 * and print. When no file has been supplied yet, it says so plainly and
 * offers the print-friendly HTML menu instead.
 */
export function OriginalMenuViewer({ src }: { src: string | null }) {
  const frameWrap = useRef<HTMLDivElement>(null);

  if (!src) {
    return (
      <div className="border-2 border-dashed border-ink/40 p-6 sm:p-8">
        <h2 className="font-display text-2xl">The printed to-go menu</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          A scan of our paper menu will appear here for viewing and download. Until then, use the print-friendly version of the menu above, or pick up a paper copy at the counter.
        </p>
        <Link href="/menu/print" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[3px] border-2 border-ink px-4 font-bold hover:bg-ink hover:text-paper">
          <Printer className="h-4 w-4" aria-hidden /> Print-friendly menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-3xl">The original printed menu</h2>
        <div className="flex flex-wrap gap-2">
          <a href={src} download className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-bamboo px-4 font-bold text-paper">
            <Download className="h-4 w-4" aria-hidden /> Download PDF
          </a>
          <button
            type="button"
            onClick={() => frameWrap.current?.requestFullscreen?.()}
            className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border-2 border-ink px-4 font-bold"
          >
            <Expand className="h-4 w-4" aria-hidden /> Full screen
          </button>
          <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border-2 border-ink px-4 font-bold">
            <Printer className="h-4 w-4" aria-hidden /> Open to print
          </a>
        </div>
      </div>
      <div ref={frameWrap} className="mt-4 h-[80vh] border-2 border-ink bg-white">
        <object data={src} type="application/pdf" className="h-full w-full" aria-label="Four Seasons printed to-go menu (PDF)">
          <p className="p-6">
            Your browser can&rsquo;t show the PDF here. <a href={src} className="font-bold underline">Download the menu</a> instead.
          </p>
        </object>
      </div>
    </div>
  );
}
