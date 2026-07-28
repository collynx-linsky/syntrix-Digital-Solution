import { adminFetch } from "@/lib/admin/fetch";
import { CategoryForm } from "@/components/admin/forms/category-form";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

type CategoryTranslation = {
  language_code: "en" | "sw" | "fr" | "ar";
  status: "draft" | "under_review" | "published";
  name: string;
  seo_title: string;
  seo_description: string;
};

type CategoryDetail = { id: number; slug: string; translations: CategoryTranslation[] };

function normalizeTranslations(translations: CategoryTranslation[]): CategoryTranslation[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return existing ?? { language_code: code, status: "draft", name: "", seo_title: "", seo_description: "" };
  });
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await adminFetch<CategoryDetail>(`/api/admin/blog/categories/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Category</h1>
      <CategoryForm
        categoryId={category.id}
        defaultValues={{ slug: category.slug, translations: normalizeTranslations(category.translations) }}
      />
    </div>
  );
}
