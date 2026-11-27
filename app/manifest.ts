import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Four Seasons Restaurant — Grants Pass",
    short_name: "Four Seasons",
    start_url: "/",
    display: "browser",
    background_color: "#FFF2DB",
    theme_color: "#B82025",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
