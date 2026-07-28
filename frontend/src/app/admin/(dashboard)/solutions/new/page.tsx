import { SolutionForm } from "@/components/admin/forms/solution-form";

export default function NewSolutionPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Solution</h1>
      <SolutionForm />
    </div>
  );
}
