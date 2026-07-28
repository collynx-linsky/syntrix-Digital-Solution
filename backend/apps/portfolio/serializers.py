from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Project, ProjectTranslation


class ProjectTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTranslation
        fields = ["language_code", "status", "title", "description", "seo_title", "seo_description"]


class ProjectSerializer(serializers.ModelSerializer):
    # SerializerMethodField so published-only filtering reuses the view's
    # .prefetch_related("translations") instead of issuing a second query.
    translations = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "slug", "client_name", "industry", "technologies",
            "image", "is_featured", "translations",
        ]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return ProjectTranslationSerializer(published, many=True).data
