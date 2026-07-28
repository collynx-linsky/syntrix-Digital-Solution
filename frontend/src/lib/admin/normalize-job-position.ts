// Plain (non-"use client") module — see normalize-service.ts.
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

export type JobPositionTranslationFormValues = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  seo_title: string;
  seo_description: string;
};

export function normalizeJobPositionTranslations(
  translations: JobPositionTranslationFormValues[],
): JobPositionTranslationFormValues[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return existing ?? { language_code: code, status: "draft", title: "", summary: "", description: "", seo_title: "", seo_description: "" };
  });
}
