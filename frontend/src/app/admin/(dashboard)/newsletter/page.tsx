import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { SubscriberRowActions } from "./row-actions";

type SubscriberRow = {
  id: number;
  email: string;
  language: string;
  is_active: boolean;
  created_at: string;
};

type SubscriberList = { count: number; next: string | null; previous: string | null; results: SubscriberRow[] };

export default async function NewsletterListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<SubscriberList>(`/api/admin/newsletter/subscribers/?page=${page}`);

  const columns: Column<SubscriberRow>[] = [
    { key: "email", header: "Email", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.email}</span> },
    { key: "language", header: "Language", render: (row) => row.language || "—" },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <span className={row.is_active ? "text-green-600 dark:text-green-400" : "text-ink-400"}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "created_at", header: "Subscribed", render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => <SubscriberRowActions id={row.id} email={row.email} isActive={row.is_active} />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Newsletter Subscribers</h1>
      <DataTable columns={columns} rows={data.results} emptyMessage="No subscribers yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
