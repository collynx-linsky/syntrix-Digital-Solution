"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, adminFetchJson } from "@/lib/admin/fetch";

export type PostTranslationInput = {
  language_code: string;
  status: string;
  title: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
};

export type PostInput = {
  slug: string;
  category: number | null;
  read_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  translations: PostTranslationInput[];
};

export async function createPost(input: PostInput) {
  const post = await adminFetchJson<{ id: number }>("/api/admin/blog/posts/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/blog/posts");
  revalidateTag("blog");
  redirect(`/admin/blog/posts/${post.id}`);
}

export async function updatePost(id: number, input: PostInput) {
  await adminFetchJson(`/api/admin/blog/posts/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/blog/posts");
  revalidatePath(`/admin/blog/posts/${id}`);
  revalidateTag("blog");
  redirect("/admin/blog/posts");
}

export async function deletePost(id: number) {
  await adminFetchJson(`/api/admin/blog/posts/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/blog/posts");
  revalidateTag("blog");
}

export async function uploadPostImage(id: number, formData: FormData) {
  await adminFetch(`/api/admin/blog/posts/${id}/image/`, {
    method: "POST",
    body: formData,
    allowRefresh: true,
  });
  revalidatePath(`/admin/blog/posts/${id}`);
  revalidatePath("/admin/blog/posts");
  revalidateTag("blog");
}
