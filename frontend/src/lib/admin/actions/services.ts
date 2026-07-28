"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetchJson } from "@/lib/admin/fetch";

export type ServiceTranslationInput = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  seo_title: string;
  seo_description: string;
};

export type ServiceInput = {
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: ServiceTranslationInput[];
};

export async function createService(input: ServiceInput) {
  const service = await adminFetchJson<{ id: number }>("/api/admin/services/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/services");
  revalidateTag("services");
  redirect(`/admin/services/${service.id}`);
}

export async function updateService(id: number, input: ServiceInput) {
  await adminFetchJson(`/api/admin/services/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
  revalidateTag("services");
  redirect("/admin/services");
}

export async function deleteService(id: number) {
  await adminFetchJson(`/api/admin/services/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/services");
  revalidateTag("services");
}
