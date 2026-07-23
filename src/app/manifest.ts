import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeetCode Progress Explorer",
    short_name: "LeetCode Explorer",
    description:
      "Analyze, compare, and visualize LeetCode coding progress with interactive charts and AI-powered insights.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
