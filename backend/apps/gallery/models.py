from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class GalleryImage(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)
    # blank=True/null=True so the admin can create the row via JSON first,
    # then upload the file separately (same two-step pattern as
    # Post.cover_image / Project.image) — a gallery entry with no image
    # yet just doesn't render on the public page (see gallery/page.tsx).
    image = models.ImageField(upload_to="gallery/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self) -> str:
        return self.slug


class GalleryImageTranslation(BaseTranslation):
    image = models.ForeignKey(GalleryImage, related_name="translations", on_delete=models.CASCADE)
    caption = models.CharField(max_length=200, blank=True)

    class Meta:
        unique_together = ("image", "language_code")
        ordering = ["image", "language_code"]

    def __str__(self) -> str:
        return f"{self.image.slug} ({self.language_code})"
