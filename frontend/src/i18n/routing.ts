import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always", // /en/, /sw/, /fr/, /ar/ — SEO-friendly, unambiguous language URLs
  pathnames: {
    "/": "/",
    "/about": {
      en: "/about",
      sw: "/kuhusu-sisi",
      fr: "/a-propos",
      ar: "/من-نحن",
    },
    "/services": {
      en: "/services",
      sw: "/huduma",
      fr: "/services",
      ar: "/خدماتنا",
    },
    "/solutions": {
      en: "/solutions",
      sw: "/suluhisho",
      fr: "/solutions",
      ar: "/حلولنا",
    },
    "/portfolio": {
      en: "/portfolio",
      sw: "/miradi",
      fr: "/portfolio",
      ar: "/أعمالنا",
    },
    "/blog": {
      en: "/blog",
      sw: "/blogu",
      fr: "/blog",
      ar: "/المدونة",
    },
    "/careers": {
      en: "/careers",
      sw: "/nafasi-za-kazi",
      fr: "/carrieres",
      ar: "/الوظائف",
    },
    "/team": {
      en: "/team",
      sw: "/timu",
      fr: "/equipe",
      ar: "/فريقنا",
    },
    "/contact": {
      en: "/contact",
      sw: "/mawasiliano",
      fr: "/contact",
      ar: "/اتصل-بنا",
    },
    "/services/[slug]": {
      en: "/services/[slug]",
      sw: "/huduma/[slug]",
      fr: "/services/[slug]",
      ar: "/خدماتنا/[slug]",
    },
    "/solutions/[slug]": {
      en: "/solutions/[slug]",
      sw: "/suluhisho/[slug]",
      fr: "/solutions/[slug]",
      ar: "/حلولنا/[slug]",
    },
    "/portfolio/[slug]": {
      en: "/portfolio/[slug]",
      sw: "/miradi/[slug]",
      fr: "/portfolio/[slug]",
      ar: "/أعمالنا/[slug]",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      sw: "/blogu/[slug]",
      fr: "/blog/[slug]",
      ar: "/المدونة/[slug]",
    },
    "/careers/[slug]": {
      en: "/careers/[slug]",
      sw: "/nafasi-za-kazi/[slug]",
      fr: "/carrieres/[slug]",
      ar: "/الوظائف/[slug]",
    },
    "/gallery": {
      en: "/gallery",
      sw: "/matunzio",
      fr: "/galerie",
      ar: "/معرض-الصور",
    },
    "/privacy": "/privacy",
    "/terms": "/terms",
    "/[slug]": "/[slug]",
  },
});

export type AppPathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
