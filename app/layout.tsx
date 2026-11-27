import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { TakeoutListProvider } from "@/components/interactive/TakeoutList";
import { restaurant, siteUrl } from "@/config/restaurant";
import { previewMode } from "@/config/site";
import { seasonBootScript } from "@/lib/season";
import { jsonLdScript, restaurantJsonLd } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
/** Decorative Chinese characters only; not preloaded, loads by unicode range on demand. */
const notoSerifSC = Noto_Serif_SC({ weight: ["700"], variable: "--font-noto-serif-sc", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Four Seasons Restaurant | Chinese Food & Takeout in Grants Pass, OR",
    template: "%s | Four Seasons Restaurant Grants Pass",
  },
  description:
    "Four Seasons Restaurant at 122 SE K Street in downtown Grants Pass, Oregon: Chinese-American favorites, dim sum and family dinners for dine-in, takeout and delivery. Call (541) 479-6532.",
  applicationName: restaurant.name,
  formatDetection: { telephone: false },
  robots: previewMode ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#B82025",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${notoSerifSC.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: seasonBootScript() }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(restaurantJsonLd())} />
      </head>
      <body className="paper-texture min-h-dvh pb-[calc(var(--mobile-bar-h)+2px+env(safe-area-inset-bottom))] lg:pb-0">
        <TakeoutListProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </TakeoutListProvider>
      </body>
    </html>
  );
}
