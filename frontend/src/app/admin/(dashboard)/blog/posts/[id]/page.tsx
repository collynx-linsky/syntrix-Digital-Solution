import { adminFetch } from "@/lib/admin/fetch";
import { PostForm } from "@/components/admin/forms/post-form";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";

type PostTranslation = {
  language_code: "en" | "sw" | "fr" | "ar";
  status: "draft" | "under_review" | "published";
  title: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
};

type PostDetail = {
  id: number;
  slug: string;
  category: number | null;
  cover_image: string | null;
  read_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  translations: PostTranslation[];
};

type CategoryList = { results: { id: number; slug: string }[] };

function normalizeTranslations(translations: PostTranslation[]): PostTranslation[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return (
      existing ?? {
        language_code: code,
        status: "draft",
        title: "",
        excerpt: "",
        content: "",
        seo_title: "",
        seo_description: "",
      }
    );
  });
}

// The API returns published_at as an ISO datetime; <input type="datetime-local">
// needs "YYYY-MM-DDTHH:mm" in local time with no timezone suffix.
function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categoryData] = await Promise.all([
    adminFetch<PostDetail>(`/api/admin/blog/posts/${id}/`),
    adminFetch<CategoryList>("/api/admin/blog/categories/"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Post</h1>
      <PostForm
        postId={post.id}
        coverImageUrl={post.cover_image}
        categories={categoryData.results}
        defaultValues={{
          slug: post.slug,
          category: post.category ? String(post.category) : "",
          read_time_minutes: post.read_time_minutes,
          is_published: post.is_published,
          published_at: toDatetimeLocal(post.published_at),
          translations: normalizeTranslations(post.translations),
        }}
      />
    </div>
  );
}
