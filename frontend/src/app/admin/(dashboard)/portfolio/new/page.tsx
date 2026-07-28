import { ProjectForm } from "@/components/admin/forms/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Project</h1>
      <ProjectForm />
    </div>
  );
}
