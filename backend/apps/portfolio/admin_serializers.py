from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import Project, ProjectTranslation


class ProjectTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = ProjectTranslation
        fields = ["language_code", "status", "title", "description", "seo_title", "seo_description"]


class ProjectAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    """image is read-only here; uploads go through ProjectAdminViewSet.image
    (multipart) — see PostAdminSerializer for the same pattern/rationale."""

    translations = ProjectTranslationWriteSerializer(many=True)
    image = serializers.ImageField(read_only=True)
    translation_model = ProjectTranslation
    translation_fk = "project"

    class Meta:
        model = Project
        fields = [
            "id", "slug", "client_name", "industry", "technologies",
            "image", "order", "is_featured", "translations",
        ]
