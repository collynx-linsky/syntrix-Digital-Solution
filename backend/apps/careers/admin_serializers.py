from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import Application, JobPosition, JobPositionTranslation


class JobPositionTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = JobPositionTranslation
        fields = ["language_code", "status", "title", "summary", "description", "seo_title", "seo_description"]


class JobPositionAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    translations = JobPositionTranslationWriteSerializer(many=True)
    translation_model = JobPositionTranslation
    translation_fk = "position"

    class Meta:
        model = JobPosition
        fields = ["id", "slug", "department", "location", "employment_type", "is_active", "translations"]


class ApplicationAdminSerializer(serializers.ModelSerializer):
    """Read-only (list/retrieve/delete only, no create/update via this API —
    applications only ever come from the public /apply/ endpoint), matching
    the existing Django admin's ApplicationAdmin treatment."""

    position_slug = serializers.CharField(source="position.slug", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id", "position", "position_slug", "full_name", "email", "phone",
            "linkedin", "cover_message", "resume", "consent", "language", "created_at",
        ]
        read_only_fields = [
            "id", "position", "position_slug", "full_name", "email", "phone",
            "linkedin", "cover_message", "resume", "consent", "language", "created_at",
        ]
