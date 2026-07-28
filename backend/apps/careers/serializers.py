from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Application, JobPosition, JobPositionTranslation


class JobPositionTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPositionTranslation
        fields = ["language_code", "status", "title", "summary", "description", "seo_title", "seo_description"]


class JobPositionSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()

    class Meta:
        model = JobPosition
        fields = ["id", "slug", "department", "location", "employment_type", "is_active", "translations"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return JobPositionTranslationSerializer(published, many=True).data


class ApplicationSerializer(serializers.ModelSerializer):
    position_slug = serializers.SlugRelatedField(
        source="position", slug_field="slug", queryset=JobPosition.objects.filter(is_active=True)
    )

    class Meta:
        model = Application
        fields = [
            "id", "position_slug", "full_name", "email", "phone",
            "linkedin", "cover_message", "resume", "consent", "language",
        ]

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError("Consent is required to submit an application.")
        return value
