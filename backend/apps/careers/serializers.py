from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Application, JobPosition, JobPositionTranslation

# Magic-byte signatures for the allowed resume formats, so a renamed script
# (e.g. resume.pdf containing HTML/JS) can't slip past the extension check.
RESUME_SIGNATURES = {
    b"%PDF-": "pdf",
    b"PK\x03\x04": "docx",  # docx is a zip archive
    b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1": "doc",  # legacy OLE format
}


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

    def validate_resume(self, value):
        header = value.read(8)
        value.seek(0)
        if not any(header.startswith(sig) for sig in RESUME_SIGNATURES):
            raise serializers.ValidationError("Resume must be a valid PDF, DOC, or DOCX file.")
        return value
