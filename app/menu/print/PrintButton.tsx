"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-red px-4 font-bold text-paper">
      <Printer className="h-4 w-4" aria-hidden /> Print this menu
    </button>
  );
}
