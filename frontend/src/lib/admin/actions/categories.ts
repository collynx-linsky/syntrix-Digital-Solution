"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetchJson } from "@/lib/admin/fetch";

export type CategoryTranslationInput = {
  language_code: string;
  status: string;
  name: string;
  seo_title: string;
  seo_description: string;
};

export type CategoryInput = {
  slug: string;
  translations: CategoryTranslationInput[];
};

export async function createCategory(input: CategoryInput) {
  const category = await adminFetchJson<{ id: number }>("/api/admin/blog/categories/", "POST", input, {
    allowRefresh: true,
  });
  revalidatePath("/admin/blog/categories");
  revalidateTag("blog"); // category label is nested inside public post responses
  redirect(`/admin/blog/categories/${category.id}`);
}

export async function updateCategory(id: number, input: CategoryInput) {
  await adminFetchJson(`/api/admin/blog/categories/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/blog/categories");
  revalidatePath(`/admin/blog/categories/${id}`);
  revalidateTag("blog");
  redirect("/admin/blog/categories");
}

export async function deleteCategory(id: number) {
  await adminFetchJson(`/api/admin/blog/categories/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/blog/categories");
  revalidateTag("blog");
}
