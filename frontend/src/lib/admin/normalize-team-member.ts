// Plain (non-"use client") module — see normalize-service.ts.
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

export type TeamMemberTranslationFormValues = {
  language_code: string;
  status: string;
  name: string;
  role: string;
  bio: string;
  seo_title: string;
  seo_description: string;
};

export function normalizeTeamMemberTranslations(
  translations: TeamMemberTranslationFormValues[],
): TeamMemberTranslationFormValues[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return existing ?? { language_code: code, status: "draft", name: "", role: "", bio: "", seo_title: "", seo_description: "" };
  });
}
