from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import GalleryImage, GalleryImageTranslation

GalleryImageTranslationInline = make_translation_inline(
    GalleryImageTranslation, extra_fields=("caption",), fk_name="image"
)


@admin.register(GalleryImage)
class GalleryImageAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "order", "is_active", "translation_status")
    list_editable = ("order", "is_active")
    inlines = [GalleryImageTranslationInline]
