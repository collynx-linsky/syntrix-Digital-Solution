import { adminFetch } from "@/lib/admin/fetch";
import { SolutionForm } from "@/components/admin/forms/solution-form";
import { normalizeSolutionTranslations } from "@/lib/admin/normalize-solution";

type SolutionTranslation = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  seo_title: string;
  seo_description: string;
};

type SolutionDetail = {
  id: number;
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: SolutionTranslation[];
};

export default async function EditSolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const solution = await adminFetch<SolutionDetail>(`/api/admin/solutions/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Solution</h1>
      <SolutionForm
        solutionId={solution.id}
        defaultValues={{
          slug: solution.slug,
          icon: solution.icon,
          order: solution.order,
          is_active: solution.is_active,
          translations: normalizeSolutionTranslations(solution.translations),
        }}
      />
    </div>
  );
}
