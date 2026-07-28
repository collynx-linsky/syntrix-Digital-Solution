"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, adminFetchJson } from "@/lib/admin/fetch";

export type TeamMemberTranslationInput = {
  language_code: string;
  status: string;
  name: string;
  role: string;
  bio: string;
  seo_title: string;
  seo_description: string;
};

export type TeamMemberInput = {
  slug: string;
  order: number;
  is_active: boolean;
  translations: TeamMemberTranslationInput[];
};

export async function createTeamMember(input: TeamMemberInput) {
  const member = await adminFetchJson<{ id: number }>("/api/admin/team/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/team");
  revalidateTag("team");
  redirect(`/admin/team/${member.id}`);
}

export async function updateTeamMember(id: number, input: TeamMemberInput) {
  await adminFetchJson(`/api/admin/team/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${id}`);
  revalidateTag("team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: number) {
  await adminFetchJson(`/api/admin/team/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/team");
  revalidateTag("team");
}

export async function uploadTeamMemberPhoto(id: number, formData: FormData) {
  await adminFetch(`/api/admin/team/${id}/photo/`, {
    method: "POST",
    body: formData,
    allowRefresh: true,
  });
  revalidatePath(`/admin/team/${id}`);
  revalidatePath("/admin/team");
  revalidateTag("team");
}
