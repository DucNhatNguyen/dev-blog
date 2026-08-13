import type { MetadataRoute } from "next";
import { siteMetadata } from "./site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "dev.notes — Lập trình chuyên sâu",
    short_name: siteMetadata.name,
    description: siteMetadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ee",
    theme_color: "#f7f3ee",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
