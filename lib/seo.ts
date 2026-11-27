import type { Metadata } from "next";
import { restaurant, siteUrl } from "@/config/restaurant";
import { previewMode } from "@/config/site";
import { DAY_NAMES, DAY_KEYS } from "@/lib/business-hours";

const DEFAULT_TITLE = "Four Seasons Restaurant | Chinese Food & Takeout in Grants Pass, OR";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} | Four Seasons Restaurant Grants Pass` : DEFAULT_TITLE;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: restaurant.name,
      locale: "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: previewMode ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/** schema.org Restaurant data. Only facts from config; no ratings markup. */
export function restaurantJsonLd() {
  const base = siteUrl();
  const spec = DAY_KEYS.flatMap((d) =>
    restaurant.hours[d].map((i) => ({ day: DAY_NAMES[d], opens: i.open, closes: i.close })),
  );
  // Group identical intervals into one OpeningHoursSpecification each.
  const grouped = new Map<string, string[]>();
  for (const s of spec) {
    const key = `${s.opens}-${s.closes}`;
    grouped.set(key, [...(grouped.get(key) ?? []), s.day]);
  }
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${base}/#restaurant`,
    name: restaurant.name,
    url: base,
    telephone: restaurant.phone.tel,
    image: `${base}/opengraph-image`,
    servesCuisine: ["Chinese", "Chinese-American", "Dim Sum"],
    acceptsReservations: false,
    hasMenu: `${base}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.city,
      addressRegion: restaurant.address.region,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: restaurant.geo.latitude, longitude: restaurant.geo.longitude },
    openingHoursSpecification: [...grouped.entries()].map(([key, days]) => {
      const [opens, closes] = key.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    ...(restaurant.hoursOverrides.length
      ? {
          specialOpeningHoursSpecification: restaurant.hoursOverrides.map((o) => ({
            "@type": "OpeningHoursSpecification",
            validFrom: o.date,
            validThrough: o.date,
            ...(o.intervals.length ? { opens: o.intervals[0]!.open, closes: o.intervals[0]!.close } : { opens: "00:00", closes: "00:00" }),
          })),
        }
      : {}),
    ...(restaurant.links.facebook ? { sameAs: [restaurant.links.facebook] } : {}),
  };
}

export function jsonLdScript(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
