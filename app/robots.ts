import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/restaurant";
import { previewMode } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (previewMode) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${siteUrl()}/sitemap.xml` };
}
