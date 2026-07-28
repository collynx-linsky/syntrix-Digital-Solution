from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import GalleryImage, GalleryImageTranslation


class GalleryImageTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = GalleryImageTranslation
        fields = ["language_code", "status", "caption", "seo_title", "seo_description"]


class GalleryImageAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    """image is read-only here; uploads go through GalleryImageAdminViewSet.image
    (multipart) — see PostAdminSerializer (blog) for the same pattern/rationale."""

    translations = GalleryImageTranslationWriteSerializer(many=True)
    image = serializers.ImageField(read_only=True)
    translation_model = GalleryImageTranslation
    translation_fk = "image"

    class Meta:
        model = GalleryImage
        fields = ["id", "slug", "image", "order", "is_active", "translations"]
