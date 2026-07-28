import type { MetadataRoute } from "next";
import { locales, localeToBcp47 } from "@/i18n/locales";
import { SITE_URL } from "@/lib/seo";
import { getServices, getSolutions, getProjects, getPosts, getJobPositions, getPages } from "@/lib/public-api";
import { RESERVED_PAGE_SLUGS } from "@/lib/reserved-page-slugs";

const STATIC_PATHS = ["", "/about", "/services", "/solutions", "/portfolio", "/blog", "/careers", "/team", "/contact"];

function alternates(path: string) {
  return Object.fromEntries(locales.map((l) => [localeToBcp47[l], `${SITE_URL}/${l}${path}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages: alternates(path) },
      });
    }
  }

  // Backend unreachable at build time — dynamic groups are skipped rather
  // than failing the whole sitemap; static paths above still get generated.
  const [services, solutions, projects, posts, positions, pages] = await Promise.all([
    getServices().catch(() => []),
    getSolutions().catch(() => []),
    getProjects().catch(() => []),
    getPosts().catch(() => []),
    getJobPositions().catch(() => []),
    getPages().catch(() => []),
  ]);

  const dynamicGroups: { base: string; slugs: string[] }[] = [
    { base: "/services", slugs: services.map((s) => s.slug) },
    { base: "/solutions", slugs: solutions.map((s) => s.slug) },
    { base: "/portfolio", slugs: projects.map((p) => p.slug) },
    { base: "/blog", slugs: posts.map((p) => p.slug) },
    { base: "/careers", slugs: positions.map((p) => p.slug) },
    // Generic admin-created pages live at the site root ("/{slug}"), not
    // under a base prefix like the groups above.
    { base: "", slugs: pages.filter((p) => !RESERVED_PAGE_SLUGS.has(p.slug)).map((p) => p.slug) },
  ];

  for (const group of dynamicGroups) {
    for (const slug of group.slugs) {
      const path = `${group.base}/${slug}`;
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}${path}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: { languages: alternates(path) },
        });
      }
    }
  }

  return entries;
}
