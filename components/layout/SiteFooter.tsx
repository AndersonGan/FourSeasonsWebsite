import Link from "next/link";
import { fullAddress, restaurant } from "@/config/restaurant";
import { navigation, previewMode } from "@/config/site";
import { groupedSchedule } from "@/lib/business-hours";
import { Emblem } from "@/components/illustrations/Emblem";

export function SiteFooter() {
  const schedule = groupedSchedule();
  return (
    <footer data-site-footer className="relative overflow-hidden bg-bamboo-deep text-paper on-dark">
      <div className="lattice text-bamboo" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Emblem className="h-12 w-12" />
            <p className="font-display text-2xl">Four Seasons</p>
          </div>
          <p className="mt-4 max-w-xs text-paper/85">{restaurant.description}</p>
          <p className="mt-4 text-sm text-paper/75">{restaurant.history.statement}</p>
        </div>

        <div>
          <h2 className="eyebrow text-amber">Visit</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {restaurant.address.street}
            <br />
            {restaurant.address.city}, {restaurant.address.region} {restaurant.address.postalCode}
          </address>
          <a href={restaurant.links.directions} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold underline decoration-amber decoration-2">
            Get directions<span className="sr-only"> to {fullAddress} (opens in a new tab)</span>
          </a>
          <p className="mt-4">
            <a href={`tel:${restaurant.phone.tel}`} className="font-display text-2xl hover:text-amber">
              {restaurant.phone.display}
            </a>
          </p>
        </div>

        <div>
          <h2 className="eyebrow text-amber">Hours</h2>
          <dl className="mt-3 space-y-1">
            {schedule.map((g) => (
              <div key={g.label} className="flex flex-wrap justify-between gap-x-3">
                <dt>{g.short}</dt>
                <dd className={g.closed ? "text-paper/70" : "font-semibold"}>{g.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-paper/70">Holiday hours may differ — please call ahead.</p>
        </div>

        <div>
          <h2 className="eyebrow text-amber">Explore</h2>
          <ul className="mt-3 space-y-1.5">
            {[{ href: "/", label: "Home" }, ...navigation, { href: "/order", label: "Order Takeout" }, { href: "/menu/print", label: "Printable Menu" }, { href: "/privacy", label: "Privacy" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-amber hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={restaurant.links.doordash} target="_blank" rel="noopener noreferrer" className="hover:text-amber hover:underline">
                Delivery on DoorDash<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-paper/75 sm:px-6 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {restaurant.name} · Grants Pass, Oregon</p>
          <p>
            Food photos: Four Seasons Restaurant. Illustrations are original artwork.
            {previewMode ? <span className="ml-2 rounded-sm bg-amber px-1.5 py-0.5 font-bold text-ink">Preview build</span> : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
