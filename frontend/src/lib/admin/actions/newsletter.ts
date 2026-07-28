"use server";

import { revalidatePath } from "next/cache";
import { adminFetchJson } from "@/lib/admin/fetch";

export async function toggleSubscriberActive(id: number, isActive: boolean) {
  await adminFetchJson(`/api/admin/newsletter/subscribers/${id}/`, "PATCH", { is_active: isActive }, { allowRefresh: true });
  revalidatePath("/admin/newsletter");
}

export async function deleteSubscriber(id: number) {
  await adminFetchJson(`/api/admin/newsletter/subscribers/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/newsletter");
}
