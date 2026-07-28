import { GalleryImageForm } from "@/components/admin/forms/gallery-image-form";

export default function NewGalleryImagePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Gallery Image</h1>
      <p className="text-sm text-ink-500 dark:text-ink-400">
        Save the entry first, then upload the photo on the next screen.
      </p>
      <GalleryImageForm />
    </div>
  );
}
