from django.apps import AppConfig


class GalleryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.gallery"
    label = "gallery"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import GalleryImage, GalleryImageTranslation

        register_translatable(
            label="Gallery Images",
            parent_model=GalleryImage,
            translation_model=GalleryImageTranslation,
            fk_name="image",
            display_field="caption",
        )
