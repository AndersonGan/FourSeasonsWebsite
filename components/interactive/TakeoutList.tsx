"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ClipboardCopy, Minus, Phone, Plus, Trash2, X } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { getItem } from "@/data/menu";
import { formatCents } from "@/lib/format";

/**
 * Personal takeout list. Saved only in this browser (localStorage).
 * It is NOT an order — nothing is sent anywhere. Customers call to order.
 */
export interface ListLine {
  key: string;
  itemId: string;
  variant?: string;
  qty: number;
}

interface Ctx {
  lines: ListLine[];
  count: number;
  add: (itemId: string, variant?: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const TakeoutCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "fs-takeout-list-v1";

export function lineKey(itemId: string, variant?: string) {
  return variant ? `${itemId}::${variant}` : itemId;
}

export function linePrice(line: ListLine): number | undefined {
  const item = getItem(line.itemId);
  if (!item) return undefined;
  if (line.variant) return item.variants?.find((v) => v.label === line.variant)?.priceCents;
  return item.priceCents;
}

export function lineLabel(line: ListLine): string {
  const item = getItem(line.itemId);
  if (!item) return "Unavailable item";
  const num = item.number && !item.name.includes(item.number) ? `#${item.number} ` : "";
  return `${num}${item.name}${line.variant ? ` (${line.variant})` : ""}${item.perPerson ? " — per person" : ""}`;
}

export function listAsText(lines: ListLine[]): string {
  const rows = lines.map((l) => `${l.qty} × ${lineLabel(l)}`);
  return [`My Four Seasons takeout list`, ...rows, ``, `(Not an order — call ${restaurant.phone.display} to place it.)`].join("\n");
}

export function TakeoutListProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<ListLine[]>([]);
  const [open, setOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ListLine[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from browser storage after mount
        setLines(parsed.filter((l) => getItem(l.itemId) && Number.isInteger(l.qty) && l.qty > 0));
      }
    } catch {
      /* storage blocked — list just won't persist */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((itemId: string, variant?: string) => {
    const key = lineKey(itemId, variant);
    const min = getItem(itemId)?.perPerson ? (getItem(itemId)?.minQuantity ?? 1) : 1;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      if (found) return ls.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + 1) } : l));
      return [...ls, { key, itemId, variant, qty: min }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l))));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  const value = useMemo(() => ({ lines, count, add, setQty, clear, open, setOpen }), [lines, count, add, setQty, clear, open]);
  return (
    <TakeoutCtx.Provider value={value}>
      {children}
      <TakeoutDrawer />
    </TakeoutCtx.Provider>
  );
}

export function useTakeoutList(): Ctx {
  const ctx = useContext(TakeoutCtx);
  if (!ctx) throw new Error("useTakeoutList must be used inside TakeoutListProvider");
  return ctx;
}

function TakeoutDrawer() {
  const { lines, setQty, clear, open, setOpen } = useTakeoutList();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const subtotal = lines.reduce((sum, l) => sum + (linePrice(l) ?? 0) * l.qty, 0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(listAsText(lines));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="takeout-title"
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) setOpen(false);
      }}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/55 open:flex open:flex-col"
    >
      <div className="flex items-start justify-between gap-4 border-b-2 border-red px-5 pb-4 pt-5">
        <div>
          <h2 id="takeout-title" className="font-display text-3xl text-red">
            My takeout list
          </h2>
          <p className="mt-1 text-sm text-ink-soft">A note for your phone call — not an order.</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink" aria-label="Close takeout list">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {lines.length === 0 ? (
          <p className="py-10 text-center text-ink-soft">
            Nothing here yet. Tap <strong className="text-ink">+ List</strong> beside any dish on the menu.
          </p>
        ) : (
          <ul className="divide-y divide-paper-edge">
            {lines.map((l) => {
              const price = linePrice(l);
              return (
                <li key={l.key} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{lineLabel(l)}</p>
                    {price !== undefined ? (
                      <p className="text-sm text-ink-soft">
                        {formatCents(price)}
                        {getItem(l.itemId)?.perPerson ? " per person" : " each"}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${lineLabel(l)}`}>
                    <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border-2 border-ink/70" onClick={() => setQty(l.key, l.qty - 1)} aria-label={l.qty === 1 ? `Remove ${lineLabel(l)}` : `One fewer ${lineLabel(l)}`}>
                      {l.qty === 1 ? <Trash2 className="h-4 w-4" aria-hidden /> : <Minus className="h-4 w-4" aria-hidden />}
                    </button>
                    <span className="w-7 text-center font-bold tabular-nums" aria-live="polite">
                      {l.qty}
                    </span>
                    <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border-2 border-ink/70" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`One more ${lineLabel(l)}`}>
                      <Plus className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t-2 border-paper-edge bg-paper-deep px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Estimated subtotal</span>
          <span className="font-display text-2xl tabular-nums" data-testid="takeout-subtotal">
            {formatCents(subtotal)}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          Menu prices before tax, add-ons and substitutions. The restaurant confirms the final total when you call. This list is saved only on this device and is never sent to us.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={`tel:${restaurant.phone.tel}`} className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-red font-bold text-paper shadow-[0_3px_0_var(--color-red-deep)]">
            <Phone className="h-5 w-5" aria-hidden /> Call to order · {restaurant.phone.display}
          </a>
          <button type="button" disabled={!lines.length} onClick={copy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border-2 border-ink font-bold disabled:opacity-40">
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <ClipboardCopy className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy list"}
          </button>
          <button type="button" disabled={!lines.length} onClick={clear} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border-2 border-ink/50 font-bold text-ink-soft disabled:opacity-40">
            Clear
          </button>
        </div>
        <p role="status" className="sr-only">
          {copied ? "List copied to clipboard" : ""}
        </p>
      </div>
    </dialog>
  );
}
