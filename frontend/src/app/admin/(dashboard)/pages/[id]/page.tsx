import { adminFetch } from "@/lib/admin/fetch";
import { PageForm } from "@/components/admin/forms/page-form";
import { HomepageSectionsForm } from "@/components/admin/forms/homepage-sections-form";
import { AboutSectionsForm } from "@/components/admin/forms/about-sections-form";
import { normalizeHomeSections } from "@/components/admin/forms/section-fields/normalize-home";
import { normalizeAboutSections } from "@/components/admin/forms/section-fields/normalize-about";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

type PageTranslation = {
  language_code: "en" | "sw" | "fr" | "ar";
  status: "draft" | "under_review" | "published";
  title: string;
  subtitle: string;
  content: string;
  sections: Record<string, unknown>;
  seo_title: string;
  seo_description: string;
};

type PageDetail = {
  id: number;
  slug: string;
  is_published: boolean;
  translations: PageTranslation[];
};

// Existing rows (e.g. created via Django admin before this panel existed)
// may not have all 4 language rows yet — fill in blanks so the form
// always renders exactly 4 tabs.
function normalizeTranslations(translations: PageTranslation[]): PageTranslation[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return (
      existing ?? {
        language_code: code,
        status: "draft",
        title: "",
        subtitle: "",
        content: "",
        sections: {},
        seo_title: "",
        seo_description: "",
      }
    );
  });
}

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await adminFetch<PageDetail>(`/api/admin/pages/${id}/`);
  const translations = normalizeTranslations(page.translations);

  if (page.slug === "homepage") {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Homepage</h1>
        <HomepageSectionsForm
          pageId={page.id}
          defaultTranslations={translations.map((t) => ({
            language_code: t.language_code,
            status: t.status,
            seo_title: t.seo_title,
            seo_description: t.seo_description,
            sections: normalizeHomeSections(t.sections),
          }))}
        />
      </div>
    );
  }

  if (page.slug === "about") {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit About Page</h1>
        <AboutSectionsForm
          pageId={page.id}
          defaultTranslations={translations.map((t) => ({
            language_code: t.language_code,
            status: t.status,
            seo_title: t.seo_title,
            seo_description: t.seo_description,
            sections: normalizeAboutSections(t.sections),
          }))}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Page</h1>
      <div className="rounded-xl border border-ink-100 bg-pale-100/60 p-4 text-sm text-ink-600 dark:border-ink-800 dark:bg-ink-900/50 dark:text-ink-300">
        <p className="font-semibold text-ink-950 dark:text-white">Want a fully custom visual layout instead?</p>
        <p className="mt-1">
          The title/subtitle/content below always work as a simple fallback page. For a richer, visually designed
          page, create a Builder.io entry (same &quot;page&quot; model used for the Homepage layout) targeting one of
          these URL paths — whichever language(s) you want a custom layout for:
        </p>
        <ul className="mt-2 space-y-1 font-mono text-xs">
          {ADMIN_LANGUAGES.map(({ code }) => (
            <li key={code}>/page/{code}/{page.slug}</li>
          ))}
        </ul>
      </div>
      <PageForm
        pageId={page.id}
        defaultValues={{
          slug: page.slug,
          is_published: page.is_published,
          translations,
        }}
      />
    </div>
  );
}
