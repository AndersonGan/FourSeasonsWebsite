import Link from "next/link";
import { BookOpen, MapPin, Phone, ShoppingBag } from "lucide-react";
import { restaurant } from "@/config/restaurant";

/**
 * Sticky bottom bar on phones: Menu / Call / Order / Directions.
 * Body gets matching bottom padding (see layout) so it never covers content.
 */
export function MobileActionBar() {
  const item = "flex min-h-[var(--mobile-bar-h)] flex-1 flex-col items-center justify-center gap-0.5 text-[0.72rem] font-bold tracking-wide";
  return (
    <nav
      data-mobile-bar
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-red-deep bg-red text-paper on-dark lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-xl">
        <Link href="/menu" className={item}>
          <BookOpen className="h-5 w-5" aria-hidden />
          Menu
        </Link>
        <a href={`tel:${restaurant.phone.tel}`} className={`${item} bg-red-deep`}>
          <Phone className="h-5 w-5" aria-hidden />
          Call
        </a>
        <Link href="/order" className={item}>
          <ShoppingBag className="h-5 w-5" aria-hidden />
          Order
        </Link>
        <a href={restaurant.links.directions} target="_blank" rel="noopener noreferrer" className={item}>
          <MapPin className="h-5 w-5" aria-hidden />
          Directions
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </a>
      </div>
    </nav>
  );
}
