import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Verdict Vault — Where Law Meets Clarity",
    short_name: "Verdict Vault",
    description:
      "A premium legal knowledge platform. The law, explained clearly and confidently.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    categories: ["news", "education", "reference"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
