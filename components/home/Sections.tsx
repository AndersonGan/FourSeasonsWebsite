import Link from "next/link";
import Image from "next/image";
import { photos, type Photo } from "@/data/photos";
import { ArrowRight, Clock, MapPin, Phone, Truck } from "lucide-react";
import { fullAddress, restaurant } from "@/config/restaurant";
import { getCategory, getItem, pickItems, type MenuItem } from "@/data/menu";
import { formatCents, lowestPrice } from "@/lib/format";
import { groupedSchedule } from "@/lib/business-hours";
import { ButtonLink, Eyebrow } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { DimSumSteamer, FamilyTable, MarFarPlate, Steam, TakeoutBox } from "@/components/illustrations/Food";
import { AnimateOnView } from "@/components/illustrations/AnimateOnView";
import { Bamboo, SprigRule } from "@/components/illustrations/Botanical";
import { Storefront } from "@/components/illustrations/Storefront";
import { SeasonShowcase } from "@/components/seasonal/SeasonShowcase";
import { FortuneCookie } from "@/components/interactive/FortuneCookie";
import { MapFacade } from "./MapFacade";

export const scheduleSummary = () =>
  groupedSchedule()
    .filter((g) => !g.closed)
    .map((g) => `${g.short} ${g.text}`)
    .join(" · ");

function Price({ item }: { item: MenuItem }) {
  const p = lowestPrice(item);
  if (p === undefined) return null;
  return (
    <span className="tabular-nums">
      {item.variants?.length ? "from " : ""}
      {formatCents(p)}
      {item.perPerson ? <span className="text-[0.8em]"> /person</span> : null}
    </span>
  );
}

/* ───────────── 1. Hero ───────────── */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:pb-20 lg:pr-10 lg:pt-20">
          <Eyebrow className="text-bamboo">Chinese-American kitchen · SE K Street · Grants Pass</Eyebrow>
          <h1 id="hero-title" className="rise-in mt-5 text-[clamp(3.1rem,10.5vw,7.4rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-red">
            Four Seasons.
            <span className="block italic text-ink">
              Endless <span className="text-red not-italic">Flavor.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-md text-xl leading-snug text-ink-soft sm:text-2xl">
            A taste of comfort in every season — Mar Far chicken, dim sum and family dinners, made for the table or the drive home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/menu" variant="red" className="px-6 text-base">
              View the To-Go Menu <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/order" variant="outline" className="text-base">
              Order Takeout
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-col gap-1.5 text-[0.95rem] font-semibold sm:flex-row sm:flex-wrap sm:gap-x-6">
            <OpenStatus fallback={scheduleSummary()} />
            <a href={`tel:${restaurant.phone.tel}`} className="inline-flex items-center gap-2 text-bamboo hover:underline">
              <Phone className="h-4 w-4" aria-hidden /> {restaurant.phone.display}
            </a>
          </div>
        </div>

        {/* Illustrated panel */}
        <div className="relative min-h-[420px] overflow-hidden bg-red sm:min-h-[520px] lg:min-h-0 lg:mr-[min(0px,calc((80rem-100vw)/2))]">
          <div className="absolute inset-3 border-2 border-paper/50 sm:inset-5" aria-hidden />
          <div className="absolute inset-[18px] border border-paper/30 sm:inset-[26px]" aria-hidden />
          <Bamboo className="absolute -right-6 bottom-0 h-[78%] w-auto opacity-95" color="#E8B64B" />
          <div className="absolute left-[8%] top-[10%] w-[66%] max-w-[420px]">
            <AnimateOnView>
              <MarFarPlate className="w-full drop-shadow-[0_10px_0_rgba(0,0,0,.12)]" />
            </AnimateOnView>
          </div>
          <div className="absolute bottom-[6%] left-[6%] w-[38%] max-w-[230px]">
            <Steam className="mx-auto -mb-3 h-14 w-20 text-paper/80" color="#FFF2DB" />
            <TakeoutBox className="w-full" />
          </div>
          <div className="absolute right-[18%] top-[8%] hidden w-[22%] max-w-[150px] sm:block">
            <DimSumSteamer className="w-full" />
          </div>
          <p className="seal absolute left-6 top-8 hidden text-2xl text-amber sm:block" aria-hidden lang="zh-Hans">
            四季美食
          </p>
          <p className="sr-only">Illustration: a plate of golden Mar Far chicken with pink sauce, a takeout box, dim sum and bamboo.</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 2. Essentials ───────────── */
export function Essentials() {
  const cell = "flex gap-3 p-5 sm:p-6";
  return (
    <section aria-label="Restaurant essentials" className="border-y-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-7xl divide-y-2 divide-ink sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x-2 [&>*]:border-ink sm:[&>*:nth-child(-n+2)]:border-b-2 lg:[&>*:nth-child(-n+2)]:border-b-0 sm:[&>*:nth-child(odd)]:border-r-2 lg:[&>*:nth-child(odd)]:border-r-0">
        <div className={cell}>
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-red" aria-hidden />
          <div>
            <h2 className="eyebrow text-ink-soft">Find us</h2>
            <p className="mt-1 font-semibold">{restaurant.address.street}, Grants Pass</p>
            <a href={restaurant.links.directions} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-bold text-bamboo underline">
              Directions<span className="sr-only"> to {fullAddress} (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className={cell}>
          <Clock className="mt-1 h-5 w-5 shrink-0 text-red" aria-hidden />
          <div>
            <h2 className="eyebrow text-ink-soft">Hours</h2>
            <p className="mt-1 font-semibold">{scheduleSummary()}</p>
            <p className="text-sm text-ink-soft">Closed Sunday & Monday</p>
          </div>
        </div>
        <div className={cell}>
          <Phone className="mt-1 h-5 w-5 shrink-0 text-red" aria-hidden />
          <div>
            <h2 className="eyebrow text-ink-soft">Call for pickup</h2>
            <a href={`tel:${restaurant.phone.tel}`} className="mt-1 block font-display text-2xl leading-none hover:text-red">
              {restaurant.phone.display}
            </a>
            <p className="mt-1 text-sm text-ink-soft">Pick up at {restaurant.address.streetShort}</p>
          </div>
        </div>
        <div className={cell}>
          <Truck className="mt-1 h-5 w-5 shrink-0 text-red" aria-hidden />
          <div>
            <h2 className="eyebrow text-ink-soft">Delivery</h2>
            <a href={restaurant.links.doordash} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold underline decoration-red decoration-2 underline-offset-4 hover:text-red">
              Order on DoorDash<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-1 text-sm text-ink-soft">Delivery prices & fees may differ</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 2b. Real plates (photos) ───────────── */
function PlateFigure({ photo, big = false }: { photo: Photo; big?: boolean }) {
  const item = photo.itemId ? getItem(photo.itemId) : undefined;
  return (
    <figure className="group flex h-full flex-col">
      <Link href={item ? `/menu#${item.id}` : "/menu"} className="flex flex-1 flex-col">
        <span
          className={`relative block w-full ${big ? "aspect-[1/1]" : photo.cutout ? "aspect-[5/4]" : "aspect-[16/9]"} ${photo.cutout ? "" : "menu-frame overflow-hidden bg-paper text-ink"}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={big ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"}
            className={`${photo.cutout ? "object-contain drop-shadow-[0_18px_22px_rgba(36,33,29,.22)]" : "object-cover p-[7px]"} transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-y-1 group-hover:rotate-[-1deg]`}
          />
        </span>
        <figcaption className="mt-3 flex items-baseline gap-3 border-t-2 border-ink pt-2">
          <span className={`font-display font-medium leading-tight group-hover:text-red ${big ? "text-3xl" : "text-xl"}`}>{item?.name ?? ""}</span>
          <span className="leader" aria-hidden />
          {item ? (
            <span className={`font-display tabular-nums ${big ? "text-2xl" : "text-lg"}`}>
              <Price item={item} />
            </span>
          ) : null}
        </figcaption>
      </Link>
    </figure>
  );
}

export function RealPlates() {
  return (
    <section aria-labelledby="plates-title" className="relative overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow className="text-red">Real plates, real portions</Eyebrow>
            <h2 id="plates-title" className="mt-4 text-5xl font-semibold sm:text-6xl">
              Straight from <span className="italic text-bamboo">our kitchen.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink-soft lg:justify-self-end">
            What you see is what comes out of the wok on K Street — generous, glossy and hot. Tap a plate to find it on the menu.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="col-span-2 lg:col-span-5">
            <PlateFigure photo={photos.orangeChicken} big />
          </div>
          <div className="lg:col-span-4">
            <PlateFigure photo={photos.generalTso} />
          </div>
          <div className="lg:col-span-3 lg:pt-16">
            <PlateFigure photo={photos.broccoliBeef} />
          </div>
          <div className="col-span-2 hidden flex-col justify-end lg:col-span-5 lg:flex">
            <p className="font-display text-3xl leading-tight">
              Ordered by the plate, <span className="italic text-red">shared by the table.</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/menu">See the full menu</ButtonLink>
              <ButtonLink href={`tel:${restaurant.phone.tel}`} variant="outline">
                <Phone className="h-4 w-4" aria-hidden /> Call to order
              </ButtonLink>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-7">
            <PlateFigure photo={photos.sweetSour} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 3. Favorites ───────────── */
const FAVORITES = ["mar-far-chicken", "orange-chicken", "general-tsos-chicken", "potstickers", "crab-puffs", "egg-flower-soup", "bbq-pork-buns"] as const;

export function Favorites() {
  const items = pickItems(FAVORITES);
  return (
    <section aria-labelledby="fav-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow className="text-red">The usual order</Eyebrow>
          <h2 id="fav-title" className="mt-4 text-5xl font-semibold sm:text-6xl">
            Good food.
            <br />
            <span className="italic text-bamboo">Good company.</span>
            <br />
            Every season.
          </h2>
          <p className="mt-6 max-w-sm text-lg text-ink-soft">
            The dishes Grants Pass keeps coming back for — crispy, saucy, generous, and easy to share.
          </p>
          <ButtonLink href="/menu" variant="ghost" className="mt-4 px-0">
            See the full menu <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
        <ol className="border-t-2 border-ink">
          {items.map((item, i) => (
            <li key={item.id} className="border-b border-ink/25">
              <Link href={`/menu#${item.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-5 sm:grid-cols-[3.5rem_1fr_auto] sm:py-6">
                <span className="font-display text-xl italic text-red sm:text-2xl" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-2xl font-medium leading-tight group-hover:text-red sm:text-[2rem]">{item.name.replace(" (white meat)", "")}</span>
                  <span className="mt-1 block text-[0.95rem] text-ink-soft">{item.description ?? item.categoryTitle}</span>
                </span>
                <span className="font-display text-xl text-ink sm:text-2xl">
                  <Price item={item} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── 4. Mar Far & pink sauce ───────────── */
export function MarFarFeature() {
  const marFar = getItem("mar-far-chicken");
  const sesame = getItem("sesame-chicken");
  return (
    <section aria-labelledby="marfar-title" className="relative overflow-hidden bg-pink">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="relative order-2 lg:order-1">
          <AnimateOnView>
            <MarFarPlate className="w-full max-w-xl drop-shadow-[0_14px_18px_rgba(120,40,50,.18)]" />
          </AnimateOnView>
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow text-red-deep">A Southern Oregon favorite</p>
          <h2 id="marfar-title" className="mt-4 text-5xl font-semibold leading-[0.95] sm:text-7xl">
            Mar Far Chicken
            <span className="block italic text-red-deep">& the pink stuff.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed">
            Around Southern Oregon, Mar Far chicken comes battered, golden and crisp, piled high for sharing — and everyone has an opinion about the pink sauce. Ours is
            white-meat chicken served with steamed rice{marFar?.priceCents ? <>, <strong>{formatCents(marFar.priceCents)}</strong> on the to-go menu</> : null}.
          </p>
          {sesame?.description ? (
            <p className="mt-3 max-w-lg text-lg leading-relaxed">
              Want heat? Try our <strong>Sesame Chicken</strong>: {sesame.description}.
            </p>
          ) : null}
          <p className="mt-3 max-w-lg text-[0.95rem]">Ask about sauces when you call — we&rsquo;re happy to help.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/menu#mar-far-chicken" variant="red">
              Find it on the menu
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 5. Family dinners ───────────── */
export function FamilyDinners() {
  const cat = getCategory("family-dinners");
  if (!cat) return null;
  return (
    <section aria-labelledby="family-title" className="relative overflow-hidden bg-red text-paper on-dark">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-28">
        <div>
          <p className="eyebrow text-amber-light">Family style dinners</p>
          <h2 id="family-title" className="mt-4 text-5xl font-semibold leading-[0.95] sm:text-6xl">
            Good things come to the table <span className="italic text-amber">together.</span>
          </h2>
          {cat.note ? <p className="mt-6 max-w-md text-lg text-paper/90">{cat.note}</p> : null}
          <FamilyTable className="mt-10 w-full max-w-sm" />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:self-center">
          {cat.items.map((item) => (
            <li key={item.id} className="menu-frame flex flex-col bg-paper p-6 text-ink" style={{ ["--frame-gap" as string]: "var(--color-paper)" }}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-3xl font-semibold text-red">{item.name.replace("Family Dinner ", "")}</h3>
                <span className="font-display text-xl">
                  <Price item={item} />
                </span>
              </div>
              {item.components ? (
                <ul className="mt-3 space-y-0.5 text-[0.95rem]">
                  {item.components.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span aria-hidden className="text-bamboo">✦</span>
                      {c}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.description?.includes("·") ? (
                <p className="mt-auto pt-3 text-sm font-semibold text-bamboo">{item.description.split("·")[1]!.trim()}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── 6. Dim sum ───────────── */
export function DimSum() {
  const cat = getCategory("dim-sum");
  if (!cat) return null;
  return (
    <section aria-labelledby="dimsum-title" className="relative overflow-hidden bg-bamboo text-paper on-dark">
      <div className="lattice text-bamboo-deep" aria-hidden />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="relative mx-auto w-full max-w-md lg:order-2">
          <Steam className="absolute -top-10 left-1/2 h-20 w-28 -translate-x-1/2" color="#FFF2DB" />
          <DimSumSteamer className="w-full" />
        </div>
        <div>
          <p className="eyebrow text-amber-light">Dim sum</p>
          <h2 id="dimsum-title" className="mt-4 text-5xl font-semibold sm:text-7xl">
            Little bites.
            <br />
            <span className="italic text-amber">Big happiness.</span>
          </h2>
          <ul className="mt-10 max-w-lg">
            {cat.items.map((item) => (
              <li key={item.id} className="flex items-baseline gap-3 border-b border-paper/25 py-3">
                <Link href={`/menu#${item.id}`} className="font-display text-2xl hover:text-amber">
                  {item.name}
                </Link>
                <span className="leader !border-paper/40" aria-hidden />
                <span className="font-display text-xl">
                  <Price item={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 7. Seasons ───────────── */
export function Seasons() {
  return (
    <section aria-labelledby="seasons-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <Eyebrow className="text-red">Four seasons on K Street</Eyebrow>
          <h2 id="seasons-title" className="mt-4 text-5xl font-semibold sm:text-6xl">
            Same kitchen. <span className="italic text-bamboo">Every season.</span>
          </h2>
        </div>
        <p className="max-w-md text-lg text-ink-soft lg:justify-self-end">
          Our name, drawn four ways. Tap a season to see the site change with it — the menu stays the same all year.
        </p>
      </div>
      <SeasonShowcase />
    </section>
  );
}

/* ───────────── 8. Takeout ───────────── */
export function Takeout() {
  return (
    <section aria-labelledby="takeout-title-home" className="relative overflow-hidden bg-amber">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <p className="eyebrow text-red-deep">Takeout & pickup</p>
          <h2 id="takeout-title-home" className="mt-4 text-5xl font-semibold leading-[0.95] sm:text-7xl">
            Good food <span className="italic text-red">travels well.</span>
          </h2>
          <ol className="mt-8 max-w-lg space-y-4 text-lg">
            {[
              ["Browse", "the to-go menu and build a list if it helps."],
              ["Call", `${restaurant.phone.display} to place your order.`],
              ["Pick up", `at ${restaurant.address.street} — or get delivery through DoorDash.`],
            ].map(([a, b], i) => (
              <li key={a} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red font-display text-lg text-paper">{i + 1}</span>
                <span>
                  <strong>{a}</strong> {b}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`tel:${restaurant.phone.tel}`} variant="red">
              <Phone className="h-4 w-4" aria-hidden /> Call {restaurant.phone.display}
            </ButtonLink>
            <ButtonLink href="/menu" variant="outline">
              Menu
            </ButtonLink>
            <ButtonLink href={restaurant.links.doordash} variant="outline">
              DoorDash
            </ButtonLink>
          </div>
        </div>
        <div className="relative grid place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <TakeoutBox className="w-48 sm:w-56" />
          <FortuneCookie />
        </div>
      </div>
    </section>
  );
}

/* ───────────── 9. Local story ───────────── */
export function LocalStory() {
  return (
    <section aria-labelledby="story-title" className="mx-auto max-w-7xl overflow-x-clip px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <Storefront className="w-full max-w-xl" />
          <p className="stamp-in absolute right-1 -top-4 rotate-[-4deg] border-[3px] border-red px-3 py-2 text-center font-display text-red sm:right-6">
            <span className="block text-xs font-bold uppercase tracking-[0.2em]">Since at least</span>
            <span className="block text-3xl font-semibold leading-none">{restaurant.history.sinceYear}</span>
          </p>
        </div>
        <div>
          <Eyebrow className="text-bamboo">Your neighborhood Chinese kitchen</Eyebrow>
          <h2 id="story-title" className="mt-4 text-5xl font-semibold sm:text-6xl">
            Right here on <span className="italic text-red">SE K Street.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-ink-soft">
            Four Seasons has been part of the Grants Pass dining community since at least {restaurant.history.sinceYear}: a red awning downtown, bamboo by the door, and a menu built for big appetites and shared tables.
          </p>
          {restaurant.showRecognition ? (
            <ul className="mt-8 max-w-lg space-y-3 border-l-4 border-red pl-5">
              {restaurant.recognition.map((r) => (
                <li key={r.year}>
                  <span className="font-display text-lg font-semibold text-red">{r.year}</span> — <span className="text-ink-soft">{r.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <ButtonLink href="/about" variant="ghost" className="mt-6 px-0">
            Our story <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 10. Ratings (only when enabled in config) ───────────── */
export function Ratings() {
  if (!restaurant.showRatings || restaurant.ratings.length === 0) return null;
  return (
    <section aria-labelledby="ratings-title" className="border-y-2 border-ink bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 id="ratings-title" className="eyebrow text-ink-soft">What neighbors say, by the numbers</h2>
        <ul className="mt-4 flex flex-wrap gap-x-12 gap-y-4">
          {restaurant.ratings.map((r) => (
            <li key={r.platform}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group">
                <span className="font-display text-4xl text-red">{r.rating.toFixed(1)}</span>
                <span className="text-ink-soft">/{r.outOf}</span>
                <span className="ml-2 font-semibold group-hover:underline">
                  {r.platform} · {r.count} ratings
                </span>
                <span className="block text-xs text-ink-soft">As shown on {r.platform}, {r.checked}. Ratings change over time.</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── 11. Visit ───────────── */
export function Visit() {
  const schedule = groupedSchedule();
  return (
    <section aria-labelledby="visit-title" className="border-t-2 border-ink bg-paper-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div>
          <Eyebrow className="text-red">Visit us</Eyebrow>
          <h2 id="visit-title" className="mt-4 text-5xl font-semibold">
            Downtown Grants Pass
          </h2>
          <SprigRule className="mt-6 w-48 text-ink/40" />
          <address className="mt-6 text-xl not-italic leading-relaxed">
            {restaurant.address.street}
            <br />
            {restaurant.address.city}, {restaurant.address.regionName} {restaurant.address.postalCode}
          </address>
          <p className="mt-4">
            <a href={`tel:${restaurant.phone.tel}`} className="font-display text-3xl hover:text-red">
              {restaurant.phone.display}
            </a>
          </p>
          <dl className="mt-6 max-w-sm divide-y divide-ink/15 border-y border-ink/15">
            {schedule.map((g) => (
              <div key={g.label} className="flex justify-between gap-4 py-2">
                <dt className="font-semibold">{g.label}</dt>
                <dd className={g.closed ? "text-ink-soft" : ""}>{g.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-ink-soft">Holiday hours may vary — call ahead to be sure.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={restaurant.links.directions} variant="green">
              <MapPin className="h-4 w-4" aria-hidden /> Get directions
            </ButtonLink>
            <ButtonLink href="/visit" variant="outline">
              Parking, hours & FAQ
            </ButtonLink>
          </div>
        </div>
        <MapFacade className="min-h-[340px] lg:min-h-[460px]" />
      </div>
    </section>
  );
}
