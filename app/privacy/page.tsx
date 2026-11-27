import { restaurant } from "@/config/restaurant";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How the Four Seasons Restaurant website handles your information: no accounts, no payments, no tracking cookies.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="Short and plain." art={false}>
        This website is a menu and information site. It doesn&rsquo;t take orders, payments or sign-ups.
      </PageIntro>
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-24 text-lg leading-relaxed sm:px-6 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold">
        <section>
          <h2>What we collect</h2>
          <p className="mt-2">Nothing you type into this site is sent to us. There are no forms, accounts, analytics or advertising trackers, and no cookies are set by this site.</p>
        </section>
        <section>
          <h2>Your takeout list</h2>
          <p className="mt-2">
            If you use the &ldquo;+ List&rdquo; feature on the menu, the list is stored in your own browser (local storage) so it&rsquo;s still there when you come back. It never leaves your device.
            You can delete it any time with the &ldquo;Clear&rdquo; button, or by clearing your browser&rsquo;s site data.
          </p>
        </section>
        <section>
          <h2>Hosting</h2>
          <p className="mt-2">
            The site is hosted on Vercel. Like any web host, Vercel processes basic technical information (such as IP address and browser type) to deliver pages and keep the service
            secure. See Vercel&rsquo;s privacy policy for details.
          </p>
        </section>
        <section>
          <h2>Links to other services</h2>
          <p className="mt-2">
            Some buttons take you to other services — DoorDash for delivery and Google Maps for directions. The map on our pages only loads from Google if you choose &ldquo;Show
            interactive map.&rdquo; Those services have their own privacy policies.
          </p>
        </section>
        <section>
          <h2>Questions</h2>
          <p className="mt-2">
            Call us at <a href={`tel:${restaurant.phone.tel}`} className="font-bold underline">{restaurant.phone.display}</a>.
          </p>
          <p className="mt-4 text-base text-ink-soft">Last updated November 2026.</p>
        </section>
      </div>
    </>
  );
}
