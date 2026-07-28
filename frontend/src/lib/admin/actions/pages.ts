"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetchJson } from "@/lib/admin/fetch";

export type PageTranslationInput = {
  language_code: string;
  status: string;
  title: string;
  subtitle: string;
  content: string;
  seo_title: string;
  seo_description: string;
  sections?: Record<string, unknown>;
};

export type PageInput = {
  slug: string;
  is_published: boolean;
  translations: PageTranslationInput[];
};

export async function createPage(input: PageInput) {
  const page = await adminFetchJson<{ id: number }>("/api/admin/pages/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/pages");
  revalidateTag("pages");
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePage(id: number, input: PageInput) {
  await adminFetchJson(`/api/admin/pages/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
  revalidateTag("pages");
  redirect("/admin/pages");
}

export async function deletePage(id: number) {
  await adminFetchJson(`/api/admin/pages/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/pages");
  revalidateTag("pages");
}
