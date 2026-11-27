import { restaurant } from "@/config/restaurant";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Storefront } from "@/components/illustrations/Storefront";
import { FamilyTable } from "@/components/illustrations/Food";
import { Bamboo, SprigRule } from "@/components/illustrations/Botanical";

export const metadata = pageMetadata({
  title: "Our Story",
  description:
    "Four Seasons Restaurant has been part of the Grants Pass dining community since at least 2011 — a neighborhood Chinese-American kitchen on SE K Street downtown.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="Our story" title={<>Your neighborhood <span className="italic text-red">Chinese kitchen.</span></>}>
        Four Seasons sits on SE K Street in downtown Grants Pass — red awning, bamboo by the door, and a kitchen that has been feeding the neighborhood since at least {restaurant.history.sinceYear}.
      </PageIntro>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <Storefront className="w-full" />
        <div className="space-y-5 text-lg leading-relaxed">
          <h2 className="text-4xl font-semibold">What we&rsquo;re about</h2>
          <p>
            Chinese-American comfort food, made for sharing: crispy Mar Far chicken, orange and General Tso&rsquo;s chicken, potstickers and crab puffs, dim sum, chow mein,
            and family dinners that put a little of everything on the table.
          </p>
          <p>
            Come in and sit down, call ahead for pickup, or have it delivered. However you get it, the idea is the same — generous food, friendly people, and a meal that makes the
            day a bit better.
          </p>
          <SprigRule className="w-48 text-ink/40" />
        </div>
      </section>

      {restaurant.showRecognition ? (
        <section aria-labelledby="timeline" className="relative overflow-hidden bg-bamboo text-paper on-dark">
          <Bamboo className="absolute -left-10 bottom-0 h-80 w-auto opacity-25" color="#E8B64B" animate={false} />
          <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-amber-light">Along the way</p>
            <h2 id="timeline" className="mt-3 text-5xl font-semibold">
              A Grants Pass <span className="italic text-amber">regular.</span>
            </h2>
            <ol className="mt-12 border-l-2 border-amber/70">
              {restaurant.recognition.map((r) => (
                <li key={r.year} className="relative pb-10 pl-8 last:pb-0">
                  <span aria-hidden className="absolute -left-[9px] top-2 h-4 w-4 rotate-45 bg-amber" />
                  <p className="font-display text-3xl font-semibold text-amber">{r.year}</p>
                  <p className="mt-1 max-w-xl text-lg">{r.text}.</p>
                  <a href={r.source} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-paper underline">
                    Source<span className="sr-only">: {r.text} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="text-5xl font-semibold">
            Pull up a chair, <span className="italic text-bamboo">or take it home.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-ink-soft">
            We&rsquo;re open {`Tuesday through Saturday, noon to 9 PM`}. Call {restaurant.phone.display} for pickup, or stop by {restaurant.address.street}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/menu">See the menu</ButtonLink>
            <ButtonLink href="/visit" variant="outline">
              Plan a visit
            </ButtonLink>
          </div>
        </div>
        <FamilyTable className="mx-auto w-full max-w-sm" />
      </section>
    </>
  );
}
