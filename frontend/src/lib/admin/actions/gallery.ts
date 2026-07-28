"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminFetch, adminFetchJson } from "@/lib/admin/fetch";

export type GalleryImageTranslationInput = {
  language_code: string;
  status: string;
  caption: string;
  seo_title: string;
  seo_description: string;
};

export type GalleryImageInput = {
  slug: string;
  order: number;
  is_active: boolean;
  translations: GalleryImageTranslationInput[];
};

export async function createGalleryImage(input: GalleryImageInput) {
  const image = await adminFetchJson<{ id: number }>("/api/admin/gallery/", "POST", input, { allowRefresh: true });
  revalidatePath("/admin/gallery");
  revalidateTag("gallery");
  redirect(`/admin/gallery/${image.id}`);
}

export async function updateGalleryImage(id: number, input: GalleryImageInput) {
  await adminFetchJson(`/api/admin/gallery/${id}/`, "PATCH", input, { allowRefresh: true });
  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
  revalidateTag("gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryImage(id: number) {
  await adminFetchJson(`/api/admin/gallery/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/gallery");
  revalidateTag("gallery");
}

export async function uploadGalleryImageFile(id: number, formData: FormData) {
  await adminFetch(`/api/admin/gallery/${id}/image/`, {
    method: "POST",
    body: formData,
    allowRefresh: true,
  });
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/admin/gallery");
  revalidateTag("gallery");
}
