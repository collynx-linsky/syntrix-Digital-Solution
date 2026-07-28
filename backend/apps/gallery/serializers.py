from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import GalleryImage, GalleryImageTranslation


class GalleryImageTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImageTranslation
        fields = ["language_code", "status", "caption"]


class GalleryImageSerializer(serializers.ModelSerializer):
    # SerializerMethodField so published-only filtering reuses the view's
    # .prefetch_related("translations") instead of issuing a second query
    # (same pattern as blog/portfolio/pages/services/solutions/team).
    translations = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ["id", "slug", "image", "order", "translations"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return GalleryImageTranslationSerializer(published, many=True).data
