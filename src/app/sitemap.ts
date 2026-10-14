import type { MetadataRoute } from "next";
import { visibleTools } from "@/config/tools.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://filemyway.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/", "/about", "/help", "/contact", "/privacy-policy", "/terms"];

  return [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.5,
    })),
    ...visibleTools().map((tool) => ({
      url: `${SITE_URL}/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
