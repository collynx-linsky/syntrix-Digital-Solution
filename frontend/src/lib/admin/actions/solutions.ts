"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetchJson } from "@/lib/admin/fetch";

export type SolutionTranslationInput = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  seo_title: string;
  seo_description: string;
};

export type SolutionInput = {
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: SolutionTranslationInput[];
};

export async function createSolution(input: SolutionInput) {
  const solution = await adminFetchJson<{ id: number }>("/api/admin/solutions/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/solutions");
  revalidateTag("solutions");
  redirect(`/admin/solutions/${solution.id}`);
}

export async function updateSolution(id: number, input: SolutionInput) {
  await adminFetchJson(`/api/admin/solutions/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/solutions");
  revalidatePath(`/admin/solutions/${id}`);
  revalidateTag("solutions");
  redirect("/admin/solutions");
}

export async function deleteSolution(id: number) {
  await adminFetchJson(`/api/admin/solutions/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/solutions");
  revalidateTag("solutions");
}
