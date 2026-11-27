import { Phone, Store, Truck } from "lucide-react";
import { fullAddress, restaurant } from "@/config/restaurant";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { scheduleSummary } from "@/components/home/Sections";
import { TakeoutBox } from "@/components/illustrations/Food";
import { OrderListSummary } from "./OrderListSummary";

export const metadata = pageMetadata({
  title: "Order Takeout & Delivery",
  description: `Order Four Seasons for pickup by calling ${restaurant.phone.display}, or get delivery through DoorDash. ${fullAddress}.`,
  path: "/order",
});

export default function OrderPage() {
  return (
    <>
      <PageIntro eyebrow="Order" title={<>Takeout, <span className="italic text-red">your way.</span></>} art={false}>
        Pickup orders are taken by phone. For delivery, we&rsquo;re on DoorDash.
      </PageIntro>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="menu-frame relative overflow-hidden bg-red p-8 text-paper on-dark sm:p-10" style={{ ["--frame-gap" as string]: "var(--color-red)" }}>
            <TakeoutBox className="pointer-events-none absolute -bottom-6 -right-6 w-44 opacity-90 sm:w-56" seal />
            <div className="relative max-w-md">
              <Phone className="h-8 w-8 text-amber" aria-hidden />
              <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Call for pickup</h2>
              <p className="mt-3 text-lg text-paper/90">Tell us what you&rsquo;d like and when you&rsquo;ll come by. We&rsquo;ll give you a total and a pickup time on the phone.</p>
              <a href={`tel:${restaurant.phone.tel}`} className="mt-6 inline-flex min-h-14 items-center gap-3 rounded-[3px] bg-paper px-6 font-display text-3xl text-red shadow-[0_4px_0_rgba(0,0,0,.25)]" data-testid="order-call">
                {restaurant.phone.display}
              </a>
              <p className="mt-4 font-semibold">
                <OpenStatus fallback={scheduleSummary()} tone="dark" />
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border-2 border-ink p-6 sm:p-8">
              <Store className="h-7 w-7 text-bamboo" aria-hidden />
              <h2 className="mt-3 text-3xl font-semibold">Pick up at</h2>
              <address className="mt-2 text-lg not-italic">{fullAddress}</address>
              <ButtonLink href={restaurant.links.directions} variant="green" className="mt-4">
                Directions
              </ButtonLink>
            </div>
            <div className="border-2 border-ink p-6 sm:p-8">
              <Truck className="h-7 w-7 text-bamboo" aria-hidden />
              <h2 className="mt-3 text-3xl font-semibold">Delivery</h2>
              <p className="mt-2 text-ink-soft">Order delivery through DoorDash. Menu prices, fees and availability on DoorDash are set there and may differ from our in-store prices.</p>
              <ButtonLink href={restaurant.links.doordash} variant="outline" className="mt-4" data-testid="order-doordash">
                Open DoorDash
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="list-h" className="border-t-2 border-ink bg-paper-deep">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h2 id="list-h" className="text-4xl font-semibold">
            Your takeout list
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Build a list on the menu page to keep track of what everyone wants, then read it off when you call. It&rsquo;s saved only on this device — it isn&rsquo;t an order and isn&rsquo;t sent to us.
          </p>
          <OrderListSummary />
        </div>
      </section>
    </>
  );
}
