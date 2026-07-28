import { adminFetch } from "@/lib/admin/fetch";
import { PostForm } from "@/components/admin/forms/post-form";

type CategoryList = { results: { id: number; slug: string }[] };

export default async function NewPostPage() {
  const categoryData = await adminFetch<CategoryList>("/api/admin/blog/categories/");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Post</h1>
      <PostForm categories={categoryData.results} />
    </div>
  );
}
