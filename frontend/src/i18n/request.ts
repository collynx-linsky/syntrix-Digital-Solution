import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Locale } from "./locales";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    // Namespaced message files keep translations independently editable
    // per section, mirroring how the CMS/admin will manage them per-page.
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      nav: (await import(`../messages/${locale}/nav.json`)).default,
      footer: (await import(`../messages/${locale}/footer.json`)).default,
      home: (await import(`../messages/${locale}/home.json`)).default,
      about: (await import(`../messages/${locale}/about.json`)).default,
      services: (await import(`../messages/${locale}/services.json`)).default,
      solutions: (await import(`../messages/${locale}/solutions.json`)).default,
      portfolio: (await import(`../messages/${locale}/portfolio.json`)).default,
      blog: (await import(`../messages/${locale}/blog.json`)).default,
      careers: (await import(`../messages/${locale}/careers.json`)).default,
      team: (await import(`../messages/${locale}/team.json`)).default,
      contact: (await import(`../messages/${locale}/contact.json`)).default,
      seo: (await import(`../messages/${locale}/seo.json`)).default,
    },
  };
});
