"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, adminFetchJson } from "@/lib/admin/fetch";

export type ProjectTranslationInput = {
  language_code: string;
  status: string;
  title: string;
  description: string;
  seo_title: string;
  seo_description: string;
};

export type ProjectInput = {
  slug: string;
  client_name: string;
  industry: string;
  technologies: string[];
  order: number;
  is_featured: boolean;
  translations: ProjectTranslationInput[];
};

export async function createProject(input: ProjectInput) {
  const project = await adminFetchJson<{ id: number }>("/api/admin/portfolio/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/portfolio");
  revalidateTag("portfolio");
  redirect(`/admin/portfolio/${project.id}`);
}

export async function updateProject(id: number, input: ProjectInput) {
  await adminFetchJson(`/api/admin/portfolio/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${id}`);
  revalidateTag("portfolio");
  redirect("/admin/portfolio");
}

export async function deleteProject(id: number) {
  await adminFetchJson(`/api/admin/portfolio/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/portfolio");
  revalidateTag("portfolio");
}

export async function uploadProjectImage(id: number, formData: FormData) {
  await adminFetch(`/api/admin/portfolio/${id}/image/`, {
    method: "POST",
    body: formData,
    allowRefresh: true,
  });
  revalidatePath(`/admin/portfolio/${id}`);
  revalidatePath("/admin/portfolio");
  revalidateTag("portfolio");
}
