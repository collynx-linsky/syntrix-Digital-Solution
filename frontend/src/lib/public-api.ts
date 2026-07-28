import { API_URL } from "@/lib/api";

// Safety-net revalidation for edits made via raw Django admin, which bypass
// this app's Server Actions (and therefore its revalidateTag calls). Real
// freshness for /admin-driven edits comes from revalidateTag, not this.
const SAFETY_REVALIDATE_SECONDS = 3600;

// Matches today's "render everything, no pagination UI" behavior. A 201st
// item would be silently dropped — acceptable at current catalog size.
const MAX_PAGES = 10;

export type PublicTag = "blog" | "portfolio" | "pages" | "gallery" | "services" | "solutions" | "team" | "careers";

export class PublicApiNotFoundError extends Error {}

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

async function fetchJSON<T>(url: string, tags: PublicTag[]): Promise<T> {
  const res = await fetch(url, { next: { tags, revalidate: SAFETY_REVALIDATE_SECONDS } });
  if (res.status === 404) throw new PublicApiNotFoundError(url);
  if (!res.ok) throw new Error(`Public API request failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

export function getPublicJSON<T>(path: string, tags: PublicTag[]): Promise<T> {
  return fetchJSON<T>(`${API_URL}${path}`, tags);
}

/** Follows DRF's `next` (an absolute URL) until exhausted or MAX_PAGES reached. */
export async function getAllPublished<T>(path: string, tags: PublicTag[]): Promise<T[]> {
  const results: T[] = [];
  let url: string | null = `${API_URL}${path}`;
  let pages = 0;
  while (url && pages < MAX_PAGES) {
    const page: Paginated<T> = await fetchJSON<Paginated<T>>(url, tags);
    results.push(...page.results);
    url = page.next;
    pages += 1;
  }
  return results;
}

export type PublicTranslation = { language_code: string; status: string };

/** Published-only lookup (defensive — the backend already filters), exact
 * locale match first, falls back to "en", else null (treat as not-found). */
export function pickTranslation<T extends PublicTranslation>(translations: T[], locale: string): T | null {
  const published = translations.filter((t) => t.status === "published");
  return published.find((t) => t.language_code === locale) ?? published.find((t) => t.language_code === "en") ?? null;
}

export type PublicCategory = { id: number; slug: string; translations: (PublicTranslation & { name: string })[] };

/** Falls back to the raw slug if the category has no published translation
 * in any language — cosmetic fallback, slug isn't draft content. */
export function pickCategoryLabel(category: PublicCategory | null, locale: string): string {
  if (!category) return "";
  return pickTranslation(category.translations, locale)?.name ?? category.slug;
}

// --- Blog ---
export type PublicPostTranslation = PublicTranslation & {
  title: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
};
export type PublicPost = {
  id: number;
  slug: string;
  category: PublicCategory | null;
  cover_image: string | null;
  read_time_minutes: number;
  published_at: string | null;
  translations: PublicPostTranslation[];
};

export const getPosts = () => getAllPublished<PublicPost>("/api/blog/posts/", ["blog"]);

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  try {
    return await getPublicJSON<PublicPost>(`/api/blog/posts/${slug}/`, ["blog"]);
  } catch (e) {
    if (e instanceof PublicApiNotFoundError) return null;
    throw e;
  }
}

// --- Portfolio ---
export type PublicProjectTranslation = PublicTranslation & {
  title: string;
  description: string;
  seo_title: string;
  seo_description: string;
};
export type PublicProject = {
  id: number;
  slug: string;
  client_name: string;
  industry: string;
  technologies: string[];
  image: string | null;
  is_featured: boolean;
  translations: PublicProjectTranslation[];
};

export const getProjects = () => getAllPublished<PublicProject>("/api/portfolio/", ["portfolio"]);

export async function getProjectBySlug(slug: string): Promise<PublicProject | null> {
  try {
    return await getPublicJSON<PublicProject>(`/api/portfolio/${slug}/`, ["portfolio"]);
  } catch (e) {
    if (e instanceof PublicApiNotFoundError) return null;
    throw e;
  }
}

export async function getFeaturedProjects(limit = 4): Promise<PublicProject[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.is_featured).slice(0, limit);
}

// --- Pages (template-driven pages like Homepage/About — see PageTranslation.sections) ---
export type PublicPageTranslation = PublicTranslation & {
  title: string;
  subtitle: string;
  content: string;
  sections: Record<string, unknown>;
  seo_title: string;
  seo_description: string;
};
export type PublicPage = {
  id: number;
  slug: string;
  is_published: boolean;
  translations: PublicPageTranslation[];
};

export async function getPageBySlug(slug: string): Promise<PublicPage | null> {
  try {
    return await getPublicJSON<PublicPage>(`/api/pages/${slug}/`, ["pages"]);
  } catch (e) {
    if (e instanceof PublicApiNotFoundError) return null;
    throw e;
  }
}

export const getPages = () => getAllPublished<PublicPage>("/api/pages/", ["pages"]);

/**
 * Like pickTranslation, but for section-driven pages (Homepage/About):
 * a translation can be "published" from before `sections` existed (only
 * the old flat title/subtitle fields were ever set), so a locale match
 * with empty sections is treated as not-ready and falls through to
 * English rather than rendering a half-built page.
 */
export function pickSectionsTranslation(
  translations: PublicPageTranslation[],
  locale: string,
): PublicPageTranslation | null {
  const hasSections = (t: PublicPageTranslation) => Object.keys(t.sections ?? {}).length > 0;
  const published = translations.filter((t) => t.status === "published" && hasSections(t));
  return published.find((t) => t.language_code === locale) ?? published.find((t) => t.language_code === "en") ?? null;
}

// --- Gallery ---
export type PublicGalleryImageTranslation = PublicTranslation & { caption: string };
export type PublicGalleryImage = {
  id: number;
  slug: string;
  image: string | null;
  order: number;
  translations: PublicGalleryImageTranslation[];
};

export const getGalleryImages = () => getAllPublished<PublicGalleryImage>("/api/gallery/", ["gallery"]);

// --- Services ---
export type PublicServiceTranslation = PublicTranslation & {
  title: string;
  summary: string;
  description: string;
  features: string[];
  seo_title: string;
  seo_description: string;
};
export type PublicService = {
  id: number;
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: PublicServiceTranslation[];
};

export const getServices = () => getAllPublished<PublicService>("/api/services/", ["services"]);

export async function getServiceBySlug(slug: string): Promise<PublicService | null> {
  try {
    return await getPublicJSON<PublicService>(`/api/services/${slug}/`, ["services"]);
  } catch (e) {
    if (e instanceof PublicApiNotFoundError) return null;
    throw e;
  }
}

// --- Solutions ---
export type PublicSolutionTranslation = PublicTranslation & {
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  seo_title: string;
  seo_description: string;
};
export type PublicSolution = {
  id: number;
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: PublicSolutionTranslation[];
};

export const getSolutions = () => getAllPublished<PublicSolution>("/api/solutions/", ["solutions"]);

export async function getSolutionBySlug(slug: string): Promise<PublicSolution | null> {
  try {
    return await getPublicJSON<PublicSolution>(`/api/solutions/${slug}/`, ["solutions"]);
  } catch (e) {
    if (e instanceof PublicApiNotFoundError) return null;
    throw e;
  }
}

// --- Team ---
export type PublicTeamMemberTranslation = PublicTranslation & { name: string; role: string; bio: string };
export type PublicTeamMember = {
  id: number;
  slug: string;
  photo: string | null;
  order: number;
  translations: PublicTeamMemberTranslation[];
};

export const getTeamMembers = () => getAllPublished<PublicTeamMember>("/api/team/", ["team"]);

// --- Careers ---
export type PublicJobPositionTranslation = PublicTranslation & {
  title: string;
  summary: string;
  description: string;
  seo_title: string;
  seo_description: string;
};
export type PublicJobPosition = {
  id: number;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  is_active: boolean;
  translations: PublicJobPositionTranslation[];
};

export const getJobPositions = () => getAllPublished<PublicJobPosition>("/api/careers/", ["careers"]);

export async function getJobPositionBySlug(slug: string): Promise<PublicJobPosition | null> {
  try {
    return await getPublicJSON<PublicJobPosition>(`/api/careers/${slug}/`, ["careers"]);
  } catch (e) {
    if (e instanceof PublicApiNotFoundError) return null;
    throw e;
  }
}
