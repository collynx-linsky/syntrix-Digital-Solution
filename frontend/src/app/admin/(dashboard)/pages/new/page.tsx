import { PageForm } from "@/components/admin/forms/page-form";

export default function NewPagePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Page</h1>
      <PageForm />
    </div>
  );
}
