"use client";

import Link from "next/link";
import { lineLabel, linePrice, useTakeoutList } from "@/components/interactive/TakeoutList";
import { formatCents } from "@/lib/format";

export function OrderListSummary() {
  const { lines, setOpen } = useTakeoutList();
  if (lines.length === 0) {
    return (
      <p className="mt-6">
        Your list is empty.{" "}
        <Link href="/menu" className="font-bold text-red underline">
          Browse the menu
        </Link>{" "}
        and tap <strong>+ List</strong> next to a dish.
      </p>
    );
  }
  const subtotal = lines.reduce((s, l) => s + (linePrice(l) ?? 0) * l.qty, 0);
  return (
    <div className="mt-6">
      <ul className="divide-y divide-ink/15 border-y border-ink/15">
        {lines.map((l) => (
          <li key={l.key} className="flex justify-between gap-4 py-2">
            <span>
              <strong>{l.qty} ×</strong> {lineLabel(l)}
            </span>
            <span className="tabular-nums">{formatCents((linePrice(l) ?? 0) * l.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between font-bold">
        <span>Estimated subtotal (before tax)</span>
        <span className="tabular-nums">{formatCents(subtotal)}</span>
      </p>
      <button type="button" onClick={() => setOpen(true)} className="mt-4 inline-flex min-h-11 items-center rounded-[3px] border-2 border-ink px-4 font-bold hover:bg-ink hover:text-paper">
        Edit or copy list
      </button>
    </div>
  );
}
