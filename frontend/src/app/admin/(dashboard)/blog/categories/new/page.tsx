import { CategoryForm } from "@/components/admin/forms/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Category</h1>
      <CategoryForm />
    </div>
  );
}
