from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import Page, PageTranslation


class PageTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = PageTranslation
        fields = ["language_code", "status", "title", "subtitle", "content", "sections", "seo_title", "seo_description"]


class PageAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    translations = PageTranslationWriteSerializer(many=True)
    translation_model = PageTranslation
    translation_fk = "page"

    class Meta:
        model = Page
        fields = ["id", "slug", "is_published", "translations", "updated_at"]
        read_only_fields = ["updated_at"]
