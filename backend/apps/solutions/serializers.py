from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Solution, SolutionTranslation


class SolutionTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolutionTranslation
        fields = ["language_code", "status", "title", "summary", "description", "capabilities", "seo_title", "seo_description"]


class SolutionSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()

    class Meta:
        model = Solution
        fields = ["id", "slug", "icon", "order", "is_active", "translations"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return SolutionTranslationSerializer(published, many=True).data
