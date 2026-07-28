import { adminFetch } from "@/lib/admin/fetch";
import { GalleryImageForm } from "@/components/admin/forms/gallery-image-form";
import { normalizeGalleryImageTranslations, type GalleryImageTranslationFormValues } from "@/lib/admin/normalize-gallery";

type GalleryImageDetail = {
  id: number;
  slug: string;
  image: string | null;
  order: number;
  is_active: boolean;
  translations: GalleryImageTranslationFormValues[];
};

export default async function EditGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await adminFetch<GalleryImageDetail>(`/api/admin/gallery/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Gallery Image</h1>
      <GalleryImageForm
        imageId={image.id}
        imageUrl={image.image}
        defaultValues={{
          slug: image.slug,
          order: image.order,
          is_active: image.is_active,
          translations: normalizeGalleryImageTranslations(image.translations),
        }}
      />
    </div>
  );
}
