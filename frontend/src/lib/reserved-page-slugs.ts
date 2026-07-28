/** Top-level slugs already owned by a literal route folder under
 * [locale] (or, for "homepage", by the root "/" route) — a generic
 * admin-created Page with one of these slugs can never actually be
 * reached via the [locale]/[slug] catch-all, so it's excluded wherever
 * generic pages are listed (nav, sitemap, static params). */
export const RESERVED_PAGE_SLUGS = new Set([
  "about", "blog", "careers", "contact", "gallery", "portfolio",
  "privacy", "services", "solutions", "team", "terms", "homepage",
]);
