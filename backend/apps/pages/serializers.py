from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Page, PageTranslation


class PageTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageTranslation
        fields = ["language_code", "status", "title", "subtitle", "content", "sections", "seo_title", "seo_description"]


class PageSerializer(serializers.ModelSerializer):
    # SerializerMethodField so published-only filtering reuses the view's
    # .prefetch_related("translations") instead of issuing a second query
    # (same pattern as apps.blog/apps.portfolio's public serializers).
    translations = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ["id", "slug", "is_published", "translations", "updated_at"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return PageTranslationSerializer(published, many=True).data
