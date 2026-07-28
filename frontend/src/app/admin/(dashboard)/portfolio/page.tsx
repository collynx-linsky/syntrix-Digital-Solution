import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { DeleteProjectButton } from "./delete-button";

type ProjectRow = {
  id: number;
  slug: string;
  client_name: string;
  industry: string;
  is_featured: boolean;
};

type ProjectList = { count: number; next: string | null; previous: string | null; results: ProjectRow[] };

export default async function PortfolioListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<ProjectList>(`/api/admin/portfolio/?page=${page}`);

  const columns: Column<ProjectRow>[] = [
    { key: "slug", header: "Slug", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.slug}</span> },
    { key: "client_name", header: "Client" },
    { key: "industry", header: "Industry" },
    {
      key: "is_featured",
      header: "Featured",
      render: (row) => (row.is_featured ? <span className="text-gold-700 dark:text-gold-400">Yes</span> : "—"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/portfolio/${row.id}`} className="font-medium text-gold-700 hover:underline dark:text-gold-400">
            Edit
          </Link>
          <DeleteProjectButton id={row.id} slug={row.slug} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-500"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <DataTable columns={columns} rows={data.results} emptyMessage="No projects yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
