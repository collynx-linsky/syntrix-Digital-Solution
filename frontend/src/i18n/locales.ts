/**
 * Single source of truth for supported locales.
 * Adding a new language requires only: (1) an entry here, (2) a messages/<code>.json file.
 * No routing, component, or middleware code needs to change.
 */
export const locales = ["en", "sw", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  sw: "Kiswahili",
  fr: "Français",
  ar: "العربية",
};

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

/** BCP-47 tags used for hreflang / html lang attributes. */
export const localeToBcp47: Record<Locale, string> = {
  en: "en-US",
  sw: "sw-TZ",
  fr: "fr-FR",
  ar: "ar",
};
