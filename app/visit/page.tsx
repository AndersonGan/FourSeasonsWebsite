import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { fullAddress, restaurant } from "@/config/restaurant";
import { groupedSchedule, formatIntervals } from "@/lib/business-hours";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { MapFacade } from "@/components/home/MapFacade";
import { scheduleSummary } from "@/components/home/Sections";

export const metadata = pageMetadata({
  title: "Visit Us — Hours & Directions",
  description: `Hours, directions and answers for Four Seasons Restaurant, ${fullAddress}. Open Tuesday–Saturday, noon–9 PM. Call (541) 479-6532.`,
  path: "/visit",
});

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "How do I order takeout?",
    a: (
      <>
        Call <a href={`tel:${restaurant.phone.tel}`} className="font-bold underline">{restaurant.phone.display}</a> and pick up at {restaurant.address.street}. You can browse the{" "}
        <Link href="/menu" className="font-bold underline">to-go menu</Link> first and jot down a list.
      </>
    ),
  },
  {
    q: "Do you deliver?",
    a: (
      <>
        Delivery is available through{" "}
        <a href={restaurant.links.doordash} target="_blank" rel="noopener noreferrer" className="font-bold underline">
          DoorDash<span className="sr-only"> (opens in a new tab)</span>
        </a>
        . Prices and fees on DoorDash are set by the app and may differ from our in-store menu.
      </>
    ),
  },
  { q: "Can I order online on this website?", a: "Not directly — this site doesn't take orders or payments. Call us for pickup, or use DoorDash for delivery." },
  { q: "When are lunch specials served?", a: `Lunch specials are served ${restaurant.lunchWindow.label}, on the days we're open.` },
  {
    q: "I have a food allergy. What should I do?",
    a: "Please call before you order. Ingredients and preparation vary, and we'd rather talk it through with you than have you guess from a menu description.",
  },
  { q: "Are you open on holidays?", a: "Holiday hours can change. Any closures are posted at the top of this website — when in doubt, give us a call." },
];

export default function VisitPage() {
  const schedule = groupedSchedule();
  const overrides = restaurant.hoursOverrides;
  return (
    <>
      <PageIntro eyebrow="Visit us" title={<>Downtown on <span className="italic text-red">SE K Street.</span></>}>
        Dine in, pick up, or have it delivered. Here&rsquo;s everything you need to find us.
      </PageIntro>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="eyebrow text-ink-soft">Address</h2>
            <address className="mt-2 font-display text-3xl not-italic leading-tight">
              {restaurant.address.street}
              <br />
              {restaurant.address.city}, {restaurant.address.region} {restaurant.address.postalCode}
            </address>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href={restaurant.links.directions} variant="green">
                <MapPin className="h-4 w-4" aria-hidden /> Get directions
              </ButtonLink>
              <ButtonLink href={`tel:${restaurant.phone.tel}`} variant="outline">
                <Phone className="h-4 w-4" aria-hidden /> {restaurant.phone.display}
              </ButtonLink>
            </div>
          </div>
          <div>
            <h2 className="eyebrow text-ink-soft">Hours</h2>
            <p className="mt-2 font-semibold">
              <OpenStatus fallback={scheduleSummary()} />
            </p>
            <table className="mt-3 w-full max-w-md text-left">
              <caption className="sr-only">Weekly opening hours</caption>
              <tbody className="divide-y divide-ink/15 border-y border-ink/15">
                {schedule.map((g) => (
                  <tr key={g.label}>
                    <th scope="row" className="py-2.5 font-semibold">
                      {g.label}
                    </th>
                    <td className={`py-2.5 text-right ${g.closed ? "text-ink-soft" : ""}`}>{g.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-ink-soft">Lunch specials {restaurant.lunchWindow.label}. Hours shown in Pacific Time.</p>
            {overrides.length ? (
              <div className="mt-4 border-l-4 border-mandarin bg-white/50 p-3">
                <h3 className="font-bold">Special hours</h3>
                <ul className="mt-1 text-sm">
                  {overrides.map((o) => (
                    <li key={o.date}>
                      {new Date(`${o.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}: {o.label} ({formatIntervals(o.intervals)})
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div>
            <h2 className="eyebrow text-ink-soft">Parking</h2>
            <p className="mt-2 max-w-md text-ink-soft">We&rsquo;re downtown, so parking availability varies through the day. Call ahead and your order can be ready when you arrive.</p>
          </div>
        </div>
        <MapFacade className="min-h-[360px] lg:min-h-[560px]" />
      </section>

      <section aria-labelledby="faq" className="border-t-2 border-ink bg-paper-deep">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 id="faq" className="text-4xl font-semibold">
            Good to know
          </h2>
          <div className="mt-8 divide-y divide-ink/20 border-y border-ink/20">
            {faqs.map((f) => (
              <details key={f.q} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-2xl text-red transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-5 pr-8 text-lg text-ink-soft">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
