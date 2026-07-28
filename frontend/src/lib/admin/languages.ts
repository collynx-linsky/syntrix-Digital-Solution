// Plain (non-"use client") module — Server Components and Client
// Components both need ADMIN_LANGUAGES as a real array. Exports from a
// "use client" module become opaque client references when imported into
// a Server Component, so this constant can't live in language-tabs.tsx.
export const ADMIN_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
] as const;

export type AdminLanguageCode = (typeof ADMIN_LANGUAGES)[number]["code"];
