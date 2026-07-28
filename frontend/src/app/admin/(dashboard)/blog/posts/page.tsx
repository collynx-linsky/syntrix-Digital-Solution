import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin/fetch";
import { DataTable, Pagination, type Column } from "@/components/admin/data-table";
import { DeletePostButton } from "./delete-button";

type PostRow = {
  id: number;
  slug: string;
  category: number | null; // FK id — admin serializer keeps writes simple, not nested
  is_published: boolean;
  published_at: string | null;
};

type PostList = { count: number; next: string | null; previous: string | null; results: PostRow[] };
type CategoryList = { results: { id: number; slug: string }[] };

export default async function PostsListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const [data, categoryData] = await Promise.all([
    adminFetch<PostList>(`/api/admin/blog/posts/?page=${page}`),
    adminFetch<CategoryList>("/api/admin/blog/categories/"),
  ]);
  const categoryBySlugId = new Map(categoryData.results.map((cat) => [cat.id, cat.slug]));

  const columns: Column<PostRow>[] = [
    { key: "slug", header: "Slug", render: (row) => <span className="font-medium text-ink-900 dark:text-white">{row.slug}</span> },
    { key: "category", header: "Category", render: (row) => (row.category ? categoryBySlugId.get(row.category) ?? "—" : "—") },
    {
      key: "is_published",
      header: "Status",
      render: (row) => (
        <span className={row.is_published ? "text-green-600 dark:text-green-400" : "text-ink-400"}>
          {row.is_published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/blog/posts/${row.id}`} className="font-medium text-gold-700 hover:underline dark:text-gold-400">
            Edit
          </Link>
          <DeletePostButton id={row.id} slug={row.slug} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Blog Posts</h1>
        <Link
          href="/admin/blog/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-500"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <DataTable columns={columns} rows={data.results} emptyMessage="No posts yet." />
      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
