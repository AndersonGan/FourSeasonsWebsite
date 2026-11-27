"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Flame, ListPlus, Search, X } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/data/menu-schema";
import { searchMenu, type SearchableItem } from "@/lib/menu-search";
import { formatCents } from "@/lib/format";
import { useTakeoutList } from "@/components/interactive/TakeoutList";

type Filter = "all" | "spice" | "lunch";

export function MenuExplorer({ categories }: { categories: MenuCategory[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const [showTop, setShowTop] = useState(false);
  const deferred = useDeferredValue(query);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { count, setOpen } = useTakeoutList();

  const flat: SearchableItem[] = useMemo(
    () => categories.flatMap((c) => c.items.map((i) => ({ ...i, categoryId: c.id, categoryTitle: c.title }))),
    [categories],
  );

  const visibleIds = useMemo(() => {
    let items = searchMenu(flat, deferred);
    if (filter === "spice") items = items.filter((i) => i.spiceAdjustable);
    if (filter === "lunch") items = items.filter((i) => i.categoryId === "lunch");
    return new Set(items.map((i) => i.id));
  }, [flat, deferred, filter]);

  const filtering = deferred.trim() !== "" || filter !== "all";
  const resultCount = visibleIds.size;

  // Scroll-spy: the active section is the last one whose top has passed the sticky bars.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = Math.max(window.innerHeight * 0.36, 280);
      let current = categories[0]?.id ?? "";
      for (const c of categories) {
        const el = document.getElementById(`cat-${c.id}`);
        if (!el || el.hidden) continue;
        if (el.getBoundingClientRect().top <= line) current = c.id;
        else break;
      }
      setActive(current);
      setShowTop(window.scrollY > 900);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [categories]);

  // Keep the active mobile tab in view.
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (el && tabsRef.current) {
      const box = tabsRef.current;
      box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
    }
  }, [active]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Everything" },
    { id: "spice", label: "Spice adjustable" },
    { id: "lunch", label: "Lunch (noon–4)" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Search + filters (sticky under header) */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 border-b-2 border-ink bg-paper/97 px-4 pb-3 pt-3 backdrop-blur-sm sm:-mx-6 sm:px-6 no-print">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search the menu by dish name or item number</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-bamboo" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dish or number (e.g. L3)"
              className="h-12 w-full rounded-[3px] border-2 border-bamboo bg-white/70 pl-10 pr-10 text-base placeholder:text-ink-soft/80 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-bamboo"
              enterKeyHint="search"
              autoComplete="off"
              data-testid="menu-search"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center" aria-label="Clear search">
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </label>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative inline-flex h-12 shrink-0 items-center gap-2 rounded-[3px] bg-bamboo px-3 font-bold text-paper sm:px-4"
            data-testid="open-list"
          >
            <ListPlus className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">My list</span>
            <span className="sr-only sm:hidden">My takeout list</span>
            <span className="min-w-6 rounded-full bg-paper px-1.5 text-center text-sm text-bamboo-deep" aria-label={`${count} items`}>
              {count}
            </span>
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Filter the menu">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 rounded-[3px] border-[1.5px] border-ink/40 px-3 py-1.5 text-sm font-bold aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {f.id === "spice" ? <Flame className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-mandarin" aria-hidden /> : null}
              {f.label}
            </button>
          ))}
          <p className="ml-auto shrink-0 pl-3 text-sm text-ink-soft" aria-live="polite" data-testid="result-count">
            {filtering ? `${resultCount} ${resultCount === 1 ? "dish" : "dishes"}` : ""}
          </p>
        </div>
        {/* Mobile category tabs */}
        <nav aria-label="Menu sections" className="lg:hidden">
          <div ref={tabsRef} className="-mx-4 mt-2 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]">
            {categories.map((c) => (
              <a
                key={c.id}
                data-cat={c.id}
                href={`#cat-${c.id}`}
                aria-current={active === c.id ? "true" : undefined}
                className="shrink-0 rounded-[3px] px-3 py-2 text-sm font-bold text-ink-soft aria-[current=true]:bg-red aria-[current=true]:text-paper"
              >
                {c.title}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-[13rem_1fr] xl:grid-cols-[15rem_1fr]">
        {/* Desktop sidebar */}
        <nav aria-label="Menu sections" className="hidden lg:block no-print">
          <ol className="sticky top-[calc(var(--header-h)+8rem)] max-h-[calc(100dvh-var(--header-h)-9rem)] space-y-0.5 overflow-y-auto pr-2">
            {categories.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#cat-${c.id}`}
                  aria-current={active === c.id ? "true" : undefined}
                  className="group flex items-baseline gap-2 rounded-[3px] px-2 py-1.5 font-semibold text-ink-soft hover:text-red aria-[current=true]:bg-red aria-[current=true]:text-paper"
                >
                  <span className="w-6 font-display text-sm italic opacity-80 group-aria-[current=true]:opacity-100">{String(i + 1).padStart(2, "0")}</span>
                  {c.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {filtering && resultCount === 0 ? (
            <div className="border-2 border-dashed border-ink/40 p-8 text-center" data-testid="no-results">
              <p className="font-display text-2xl">Nothing matches &ldquo;{deferred}&rdquo;.</p>
              <p className="mt-2 text-ink-soft">Try a shorter word like &ldquo;chicken&rdquo; or &ldquo;fried rice&rdquo; — or call us and ask.</p>
            </div>
          ) : null}
          {categories.map((c) => {
            const shown = c.items.filter((i) => visibleIds.has(i.id));
            return (
              <section
                key={c.id}
                id={`cat-${c.id}`}
                aria-labelledby={`h-${c.id}`}
                hidden={filtering && shown.length === 0}
                className="scroll-mt-24 pb-14 lg:scroll-mt-12"
              >
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b-[3px] border-double border-red pb-2">
                  <h2 id={`h-${c.id}`} className="font-display text-4xl font-semibold text-red sm:text-[2.75rem]">
                    {c.title}
                  </h2>
                  {c.servedWindow === "lunch" ? <p className="eyebrow pb-2 text-bamboo">Served noon – 4 PM</p> : null}
                </div>
                {c.note ? <p className="mt-3 max-w-2xl text-[0.95rem] text-ink-soft">{c.note}</p> : null}
                <ul className="mt-2">
                  {c.items.map((item) => (
                    <MenuRow key={item.id} item={item} hidden={filtering && !visibleIds.has(item.id)} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[calc(var(--mobile-bar-h)+env(safe-area-inset-bottom)+0.75rem)] right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-paper shadow-md lg:bottom-6 no-print"
          aria-label="Back to top of menu"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function MenuRow({ item, hidden }: { item: MenuItem; hidden: boolean }) {
  const { add } = useTakeoutList();
  const [added, setAdded] = useState<string | null>(null);
  const flash = (key: string) => {
    setAdded(key);
    window.setTimeout(() => setAdded((k) => (k === key ? null : k)), 1400);
  };

  const unavailable = !item.available;
  return (
    <li id={item.id} hidden={hidden} className="print-break-avoid scroll-mt-24 border-b lg:scroll-mt-12 border-ink/15 py-4 target:bg-pink-soft/60">
      <div className="flex items-baseline gap-3">
        {item.number ? (
          <span className="w-9 shrink-0 font-display text-sm font-semibold italic text-red" aria-label={`Item ${item.number}`}>
            {/^\d+$/.test(item.number) ? `№${item.number}` : item.number}
          </span>
        ) : null}
        <h3 className="font-sans text-[1.06rem] font-bold leading-snug">
          {item.name}
          {item.spiceAdjustable ? (
            <span className="ml-1.5 inline-flex translate-y-[-1px] items-center gap-0.5 align-middle text-xs font-bold text-mandarin-ink" title="Spice level adjustable">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(spice level adjustable)</span>
            </span>
          ) : null}
          {unavailable ? <span className="ml-2 rounded-sm bg-ink/10 px-1.5 text-xs font-bold uppercase">Currently unavailable</span> : null}
        </h3>
        {!item.variants?.length ? (
          <>
            <span className="leader" aria-hidden />
            <span className="shrink-0 font-display text-lg tabular-nums">
              {item.priceCents !== undefined ? formatCents(item.priceCents) : "—"}
              {item.perPerson ? <span className="text-sm text-ink-soft"> /person</span> : null}
            </span>
            {!unavailable ? <AddButton label={item.name} done={added === item.id} onClick={() => (add(item.id), flash(item.id))} /> : null}
          </>
        ) : null}
      </div>
      <div className={item.number ? "pl-12" : ""}>
        {item.description ? <p className="mt-1 max-w-2xl text-[0.95rem] leading-snug text-ink-soft">{item.description}</p> : null}
        {item.perPerson && item.minQuantity ? <p className="mt-1 text-sm font-semibold text-bamboo">Minimum {item.minQuantity} people</p> : null}
        {item.options?.length ? (
          <p className="mt-1 text-sm text-ink-soft">
            {item.options.map((o) => (
              <span key={o.label} className="mr-3 inline-block">
                <span className="font-semibold text-ink">{o.label}:</span>{" "}
                {o.choices.map((c) => (c.deltaCents ? `${c.label} (+${formatCents(c.deltaCents)})` : c.label)).join(", ")}
              </span>
            ))}
          </p>
        ) : null}
        {item.variants?.length ? (
          <ul className="mt-2 grid gap-1" aria-label={`${item.name} sizes and prices`}>
            {item.variants.map((v) => {
              const key = `${item.id}::${v.label}`;
              return (
                <li key={v.label} className="flex items-baseline gap-3">
                  <span className="text-[0.95rem]">{v.label}</span>
                  <span className="leader" aria-hidden />
                  <span className="font-display text-lg tabular-nums">{formatCents(v.priceCents)}</span>
                  {!unavailable ? <AddButton label={`${item.name}, ${v.label}`} done={added === key} onClick={() => (add(item.id, v.label), flash(key))} /> : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function AddButton({ label, onClick, done }: { label: string; onClick: () => void; done: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`no-print ml-1 inline-flex h-9 shrink-0 items-center gap-1 self-center rounded-[3px] border-[1.5px] px-2 text-xs font-bold transition-colors ${done ? "border-bamboo bg-bamboo text-paper" : "border-bamboo text-bamboo hover:bg-bamboo hover:text-paper"}`}
      aria-label={`Add ${label} to my takeout list`}
    >
      {done ? "Added" : "+ List"}
    </button>
  );
}
