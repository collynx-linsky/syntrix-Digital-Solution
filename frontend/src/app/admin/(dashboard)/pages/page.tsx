import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { DeletePageButton } from "./delete-button";

type PageRow = {
  id: number;
  slug: string;
  is_published: boolean;
  updated_at: string;
};

type PageList = { count: number; next: string | null; previous: string | null; results: PageRow[] };

export default async function PagesListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<PageList>(`/api/admin/pages/?page=${page}`);

  const columns: Column<PageRow>[] = [
    { key: "slug", header: "Slug", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.slug}</span> },
    {
      key: "is_published",
      header: "Status",
      render: (row) => (
        <span className={row.is_published ? "text-green-600 dark:text-green-400" : "text-ink-400"}>
          {row.is_published ? "Published" : "Unpublished"}
        </span>
      ),
    },
    { key: "updated_at", header: "Updated", render: (row) => new Date(row.updated_at).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/pages/${row.id}`} className="font-medium text-gold-700 hover:underline dark:text-gold-400">
            Edit
          </Link>
          <DeletePageButton id={row.id} slug={row.slug} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-500"
        >
          <Plus className="h-4 w-4" />
          New Page
        </Link>
      </div>

      <DataTable columns={columns} rows={data.results} emptyMessage="No pages yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
