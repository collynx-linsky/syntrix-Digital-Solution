// Plain (non-"use client") module — see normalize-service.ts.
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { toStringListValue, type StringListItem } from "@/components/admin/forms/section-fields/transforms";

export type SolutionTranslationFormValues = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  capabilities: StringListItem[];
  seo_title: string;
  seo_description: string;
};

export type SolutionFormValues = {
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: SolutionTranslationFormValues[];
};

export function normalizeSolutionTranslations(
  translations: { language_code: string; status: string; title: string; summary: string; description: string; capabilities: string[]; seo_title: string; seo_description: string }[],
): SolutionTranslationFormValues[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return existing
      ? { ...existing, capabilities: toStringListValue(existing.capabilities) }
      : { language_code: code, status: "draft", title: "", summary: "", description: "", capabilities: [], seo_title: "", seo_description: "" };
  });
}
