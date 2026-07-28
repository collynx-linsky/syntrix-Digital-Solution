// Plain (non-"use client") module — the Gallery edit screen is a Server
// Component and needs to call this directly; see normalize-service.ts.
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

export type GalleryImageTranslationFormValues = {
  language_code: string;
  status: string;
  caption: string;
  seo_title: string;
  seo_description: string;
};

export function normalizeGalleryImageTranslations(
  translations: GalleryImageTranslationFormValues[],
): GalleryImageTranslationFormValues[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return existing ?? { language_code: code, status: "draft", caption: "", seo_title: "", seo_description: "" };
  });
}
