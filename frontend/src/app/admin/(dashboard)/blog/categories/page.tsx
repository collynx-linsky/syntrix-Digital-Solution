import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { DeleteCategoryButton } from "./delete-button";

type CategoryRow = { id: number; slug: string };
type CategoryList = { count: number; next: string | null; previous: string | null; results: CategoryRow[] };

export default async function CategoriesListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<CategoryList>(`/api/admin/blog/categories/?page=${page}`);

  const columns: Column<CategoryRow>[] = [
    { key: "slug", header: "Slug", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.slug}</span> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/blog/categories/${row.id}`} className="font-medium text-gold-700 hover:underline dark:text-gold-400">
            Edit
          </Link>
          <DeleteCategoryButton id={row.id} slug={row.slug} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Blog Categories</h1>
        <Link
          href="/admin/blog/categories/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-500"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Link>
      </div>

      <DataTable columns={columns} rows={data.results} emptyMessage="No categories yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
