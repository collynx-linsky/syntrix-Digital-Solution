import { FileDown } from "lucide-react";
import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { DeleteApplicationButton } from "./delete-button";

type ApplicationRow = {
  id: number;
  position_slug: string;
  full_name: string;
  email: string;
  phone: string;
  resume: string | null;
  created_at: string;
};

type ApplicationList = { count: number; next: string | null; previous: string | null; results: ApplicationRow[] };

export default async function ApplicationsListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<ApplicationList>(`/api/admin/careers/applications/?page=${page}`);

  const columns: Column<ApplicationRow>[] = [
    { key: "full_name", header: "Applicant", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.full_name}</span> },
    { key: "email", header: "Email" },
    { key: "position_slug", header: "Position" },
    {
      key: "resume",
      header: "Resume",
      render: (row) =>
        row.resume ? (
          <a href={row.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-gold-700 hover:underline dark:text-gold-400">
            <FileDown className="h-3.5 w-3.5" />
            Download
          </a>
        ) : (
          "—"
        ),
    },
    { key: "created_at", header: "Applied", render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end">
          <DeleteApplicationButton id={row.id} fullName={row.full_name} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Applications</h1>
      <DataTable columns={columns} rows={data.results} emptyMessage="No applications yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
