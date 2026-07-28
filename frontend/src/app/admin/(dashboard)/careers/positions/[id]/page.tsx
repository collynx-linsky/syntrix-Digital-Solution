import { adminFetch } from "@/lib/admin/fetch";
import { JobPositionForm } from "@/components/admin/forms/job-position-form";
import { normalizeJobPositionTranslations, type JobPositionTranslationFormValues } from "@/lib/admin/normalize-job-position";

type JobPositionDetail = {
  id: number;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  is_active: boolean;
  translations: JobPositionTranslationFormValues[];
};

export default async function EditJobPositionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const position = await adminFetch<JobPositionDetail>(`/api/admin/careers/positions/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Job Position</h1>
      <JobPositionForm
        positionId={position.id}
        defaultValues={{
          slug: position.slug,
          department: position.department,
          location: position.location,
          employment_type: position.employment_type,
          is_active: position.is_active,
          translations: normalizeJobPositionTranslations(position.translations),
        }}
      />
    </div>
  );
}
