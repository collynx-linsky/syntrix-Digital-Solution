import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { DeleteJobPositionButton } from "./delete-button";

type JobPositionRow = {
  id: number;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  is_active: boolean;
};

type JobPositionList = { count: number; next: string | null; previous: string | null; results: JobPositionRow[] };

export default async function JobPositionsListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<JobPositionList>(`/api/admin/careers/positions/?page=${page}`);

  const columns: Column<JobPositionRow>[] = [
    { key: "slug", header: "Slug", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.slug}</span> },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "employment_type", header: "Type" },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <span className={row.is_active ? "text-green-600 dark:text-green-400" : "text-ink-400"}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/careers/positions/${row.id}`} className="font-medium text-gold-700 hover:underline dark:text-gold-400">
            Edit
          </Link>
          <DeleteJobPositionButton id={row.id} slug={row.slug} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Job Positions</h1>
        <Link
          href="/admin/careers/positions/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-500"
        >
          <Plus className="h-4 w-4" />
          New Position
        </Link>
      </div>

      <DataTable columns={columns} rows={data.results} emptyMessage="No job positions yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
