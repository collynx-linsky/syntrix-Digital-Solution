import { adminFetch } from "@/lib/admin/fetch";
import { ProjectForm } from "@/components/admin/forms/project-form";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

type ProjectTranslation = {
  language_code: "en" | "sw" | "fr" | "ar";
  status: "draft" | "under_review" | "published";
  title: string;
  description: string;
  seo_title: string;
  seo_description: string;
};

type ProjectDetail = {
  id: number;
  slug: string;
  client_name: string;
  industry: string;
  technologies: string[];
  image: string | null;
  order: number;
  is_featured: boolean;
  translations: ProjectTranslation[];
};

function normalizeTranslations(translations: ProjectTranslation[]): ProjectTranslation[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return (
      existing ?? {
        language_code: code,
        status: "draft",
        title: "",
        description: "",
        seo_title: "",
        seo_description: "",
      }
    );
  });
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await adminFetch<ProjectDetail>(`/api/admin/portfolio/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Project</h1>
      <ProjectForm
        projectId={project.id}
        imageUrl={project.image}
        defaultValues={{
          slug: project.slug,
          client_name: project.client_name,
          industry: project.industry,
          technologiesText: project.technologies.join(", "),
          order: project.order,
          is_featured: project.is_featured,
          translations: normalizeTranslations(project.translations),
        }}
      />
    </div>
  );
}
