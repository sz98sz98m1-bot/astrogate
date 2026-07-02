import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/articles/manifest";
import { ZODIAC_SIGNS } from "@/lib/astro/zodiac";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/natal-chart",
  "/synastry",
  "/horoscope",
  "/tools",
  "/transit-chart",
  "/solar-return",
  "/moon-calendar",
  "/retrograde",
  "/articles",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));

  const articleEntries = ARTICLES.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: now,
  }));

  const horoscopeEntries = ZODIAC_SIGNS.map((sign) => ({
    url: `${SITE_URL}/horoscope/${sign}`,
    lastModified: now,
  }));

  return [...staticEntries, ...articleEntries, ...horoscopeEntries];
}
