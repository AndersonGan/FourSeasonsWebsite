"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon, Phone, X } from "lucide-react";
import { Wordmark } from "@/components/illustrations/Emblem";
import { navigation } from "@/config/site";
import { restaurant } from "@/config/restaurant";

export function SiteHeader() {
  const pathname = usePathname();
  // Menu is open only for the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (o: boolean) => setOpenOn(o ? pathname : null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header data-site-header className="sticky top-0 z-40 border-b-2 border-red bg-paper/95 backdrop-blur-sm supports-[backdrop-filter]:bg-paper/90">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="min-w-0 shrink rounded-sm">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navigation.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isCurrent(n.href) ? "page" : undefined}
              className="relative px-3 py-2 text-[0.95rem] font-bold text-ink hover:text-red aria-[current=page]:text-red aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-[3px] aria-[current=page]:after:bg-red"
            >
              {n.label}
            </Link>
          ))}
          <a href={`tel:${restaurant.phone.tel}`} className="ml-2 inline-flex items-center gap-2 px-3 py-2 font-bold text-bamboo hover:text-bamboo-deep">
            <Phone className="h-4 w-4" aria-hidden />
            {restaurant.phone.display}
          </a>
          <Link
            href="/order"
            aria-current={isCurrent("/order") ? "page" : undefined}
            className="ml-2 inline-flex min-h-11 items-center rounded-[3px] bg-red px-5 font-bold text-paper shadow-[0_3px_0_var(--color-red-deep)] hover:bg-red-deep"
          >
            Order Now
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/order" className="inline-flex min-h-11 items-center rounded-[3px] bg-red px-4 text-sm font-bold text-paper max-[359px]:hidden">
            Order
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink text-ink"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <MenuIcon className="h-5 w-5" aria-hidden />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-paper-edge bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 pb-6 pt-2 sm:px-6">
          <ul className="divide-y divide-paper-edge">
            {[{ href: "/", label: "Home" }, ...navigation, { href: "/order", label: "Order Takeout" }].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isCurrent(n.href) ? "page" : undefined}
                  className="flex min-h-14 items-center justify-between font-display text-2xl text-ink aria-[current=page]:text-red"
                >
                  {n.label}
                  <span aria-hidden className="text-base text-red">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <a href={`tel:${restaurant.phone.tel}`} className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-bamboo">
            <Phone className="h-5 w-5" aria-hidden /> Call {restaurant.phone.display}
          </a>
        </nav>
      </div>
    </header>
  );
}
