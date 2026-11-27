import { menu } from "@/data/menu";
import { restaurant, fullAddress } from "@/config/restaurant";
import { formatCents } from "@/lib/format";
import { groupedSchedule } from "@/lib/business-hours";
import { pageMetadata } from "@/lib/seo";
import { Emblem } from "@/components/illustrations/Emblem";
import { PrintButton } from "./PrintButton";

export const metadata = pageMetadata({
  title: "Printable Menu",
  description: "A print-friendly copy of the Four Seasons Restaurant to-go menu, Grants Pass, OR.",
  path: "/menu/print",
});

export default function PrintMenuPage() {
  const hours = groupedSchedule()
    .filter((g) => !g.closed)
    .map((g) => `${g.label} ${g.text}`)
    .join(" · ");
  return (
    <article className="mx-auto max-w-5xl bg-paper px-4 py-10 sm:px-8 print:max-w-none print:bg-white print:p-0">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-4">
        <p className="text-ink-soft">This page is laid out for printing on letter paper.</p>
        <PrintButton />
      </div>
      <header className="flex items-center gap-4 border-b-[3px] border-double border-red pb-4">
        <Emblem className="h-16 w-16 shrink-0 print:h-12 print:w-12" />
        <div className="flex-1">
          <h1 className="font-display text-4xl font-semibold text-red print:text-[22pt]">Four Seasons Restaurant</h1>
          <p className="font-semibold">
            {fullAddress} · {restaurant.phone.display}
          </p>
          <p className="text-sm text-ink-soft">{hours} · Closed Sunday & Monday</p>
        </div>
      </header>
      <p className="mt-3 text-sm text-ink-soft print:mt-2 print:text-[7.5pt]">
        Prices as of {menu.meta.pricesAsOf} and subject to change. <strong className="text-mandarin-ink">*</strong> = heat level: your choice of mild, medium or spicy. Entrées come with steamed rice unless noted; pork fried rice instead is +$2.00. No MSG. Food allergies? Please call before ordering.
      </p>
      <div className="mt-6 gap-8 sm:columns-2 print:mt-3 print:columns-3 print:gap-5">
        {menu.categories.map((c) => (
          <section key={c.id} className="mb-6 break-inside-avoid-column print:mb-3">
            <h2 className="border-b-2 border-red font-display text-2xl font-semibold text-red print:text-[13pt]">
              {c.title}
              {c.servedWindow === "lunch" ? <span className="ml-2 font-sans text-sm font-bold text-bamboo">noon – 4 PM</span> : null}
            </h2>
            {c.note ? <p className="mt-1 text-xs italic text-ink-soft print:text-[7pt] print:leading-tight">{c.note}</p> : null}
            <ul className="mt-1 text-[0.92rem] print:text-[8.3pt] print:leading-tight">
              {c.items.map((i) => (
                <li key={i.id} className="break-inside-avoid py-1 print:py-[1.5pt]">
                  <div className="flex items-baseline gap-2">
                    {i.number ? <span className="w-7 shrink-0 text-xs font-bold text-red print:w-5 print:text-[7.5pt]">{i.number}</span> : null}
                    <span className="font-semibold">
                      {i.name}
                      {i.spiceAdjustable ? <span className="text-mandarin-ink"> *</span> : null}
                    </span>
                    {!i.variants?.length && i.priceCents !== undefined ? (
                      <>
                        <span className="leader" aria-hidden />
                        <span className="tabular-nums">
                          {formatCents(i.priceCents)}
                          {i.perPerson ? "/pp" : ""}
                        </span>
                      </>
                    ) : null}
                  </div>
                  {i.description ? <p className={`text-xs text-ink-soft print:text-[7pt] ${i.number ? "pl-9 print:pl-6" : ""}`}>{i.description}</p> : null}
                  {i.variants?.length ? (
                    <p className={`text-xs print:text-[7.5pt] ${i.number ? "pl-9 print:pl-6" : ""}`}>{i.variants.map((v) => `${v.label} ${formatCents(v.priceCents)}`).join(" · ")}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
