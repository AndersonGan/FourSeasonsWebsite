import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/restaurant";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const routes: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/menu", priority: 0.9, freq: "weekly" },
    { path: "/order", priority: 0.8, freq: "monthly" },
    { path: "/visit", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/gallery", priority: 0.5, freq: "monthly" },
    { path: "/menu/print", priority: 0.3, freq: "monthly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
  ];
  return routes.map((r) => ({ url: `${base}${r.path}`, changeFrequency: r.freq, priority: r.priority }));
}
