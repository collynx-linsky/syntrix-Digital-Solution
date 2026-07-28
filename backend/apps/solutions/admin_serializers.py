from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import Solution, SolutionTranslation


class SolutionTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = SolutionTranslation
        fields = ["language_code", "status", "title", "summary", "description", "capabilities", "seo_title", "seo_description"]


class SolutionAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    translations = SolutionTranslationWriteSerializer(many=True)
    translation_model = SolutionTranslation
    translation_fk = "solution"

    class Meta:
        model = Solution
        fields = ["id", "slug", "icon", "order", "is_active", "translations"]
