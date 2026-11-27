import Link from "next/link";
import { Info, Phone, Printer } from "lucide-react";
import { menu } from "@/data/menu";
import { restaurant, siteUrl } from "@/config/restaurant";
import { previewMode } from "@/config/site";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { OriginalMenuViewer } from "@/components/menu/OriginalMenuViewer";
import { Bamboo } from "@/components/illustrations/Botanical";
import { jsonLdScript, pageMetadata } from "@/lib/seo";
import { formatCents } from "@/lib/format";

export const metadata = pageMetadata({
  title: "To-Go Menu",
  description:
    "The full Four Seasons to-go menu: appetizers, dim sum, Mar Far chicken, chef's specialties, chow mein, fried rice, lo mein & chow fun, dinner combos, family dinners and lunch specials. Grants Pass, OR.",
  path: "/menu",
});

function menuJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Four Seasons To-Go Menu",
    url: `${base}/menu`,
    inLanguage: "en-US",
    hasMenuSection: menu.categories.map((c) => ({
      "@type": "MenuSection",
      name: c.title,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        ...(i.description ? { description: i.description } : {}),
        offers: (i.variants?.length ? i.variants : [{ label: undefined, priceCents: i.priceCents! }]).map((v) => ({
          "@type": "Offer",
          ...(v.label ? { name: v.label } : {}),
          price: (v.priceCents / 100).toFixed(2),
          priceCurrency: "USD",
        })),
      })),
    })),
  };
}

export default function MenuPage() {
  const pending = menu.meta.approval !== "approved";
  return (
    <>
      {menu.meta.approval === "approved" ? <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(menuJsonLd())} /> : null}
      <header className="relative overflow-hidden border-b-2 border-red bg-red text-paper on-dark">
        <Bamboo className="absolute -right-8 -top-6 h-64 w-auto opacity-30 sm:opacity-60" color="#E8B64B" animate={false} />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
          <p className="eyebrow text-amber-light">Four Seasons · Grants Pass</p>
          <h1 className="mt-3 text-6xl font-semibold sm:text-8xl">
            The To-Go <span className="italic">Menu</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-paper/90">
            Search by dish or item number, or browse by section. Call{" "}
            <a href={`tel:${restaurant.phone.tel}`} className="font-bold underline decoration-amber decoration-2 underline-offset-4">
              {restaurant.phone.display}
            </a>{" "}
            to order for pickup.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <a href={`tel:${restaurant.phone.tel}`} className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-paper px-4 font-bold text-red">
              <Phone className="h-4 w-4" aria-hidden /> Call to order
            </a>
            <Link href="/menu/print" className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border-2 border-paper px-4 font-bold">
              <Printer className="h-4 w-4" aria-hidden /> Print-friendly menu
            </Link>
            <a href={restaurant.links.doordash} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-[3px] border-2 border-paper/60 px-4 font-bold">
              Delivery on DoorDash<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="grid gap-3 text-[0.92rem] md:grid-cols-2">
          <ul className="space-y-1 text-ink-soft">
            {menu.meta.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span aria-hidden className="text-red">✦</span>
                {n.replace("+$1.00", `+${formatCents(menu.meta.spice.extraSpicyCents)}`)}
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <p className="flex gap-2 border-l-4 border-mandarin bg-white/50 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-mandarin-ink" aria-hidden />
              <span>
                <strong>Food allergies?</strong> Ingredients and preparation can vary. Please call us before ordering and we&rsquo;ll tell you what we can.
              </span>
            </p>
            <p className="text-ink-soft" data-testid="price-note">
              In-store prices as of {menu.meta.pricesAsOf}. Prices can change; we confirm your total when you order. Delivery-app prices may differ.
              {pending && previewMode ? <strong className="ml-1 text-ink">Preview: menu awaiting final check by the restaurant.</strong> : null}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <MenuExplorer categories={menu.categories} />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <OriginalMenuViewer src={menu.meta.originalDocument} />
      </div>
    </>
  );
}
