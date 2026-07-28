"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetchJson } from "@/lib/admin/fetch";

export type JobPositionTranslationInput = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  seo_title: string;
  seo_description: string;
};

export type JobPositionInput = {
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  is_active: boolean;
  translations: JobPositionTranslationInput[];
};

export async function createJobPosition(input: JobPositionInput) {
  const position = await adminFetchJson<{ id: number }>("/api/admin/careers/positions/", "POST", input, {
    allowRefresh: true,
  });
  revalidatePath("/admin/careers/positions");
  revalidateTag("careers");
  redirect(`/admin/careers/positions/${position.id}`);
}

export async function updateJobPosition(id: number, input: JobPositionInput) {
  await adminFetchJson(`/api/admin/careers/positions/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/careers/positions");
  revalidatePath(`/admin/careers/positions/${id}`);
  revalidateTag("careers");
  redirect("/admin/careers/positions");
}

export async function deleteJobPosition(id: number) {
  await adminFetchJson(`/api/admin/careers/positions/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/careers/positions");
  revalidateTag("careers");
}

export async function deleteApplication(id: number) {
  await adminFetchJson(`/api/admin/careers/applications/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/careers/applications");
}
