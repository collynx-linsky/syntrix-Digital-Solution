from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import TeamMember, TeamMemberTranslation


class TeamMemberTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = TeamMemberTranslation
        fields = ["language_code", "status", "name", "role", "bio", "seo_title", "seo_description"]


class TeamMemberAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    """photo is read-only here; uploads go through TeamMemberAdminViewSet.photo
    (multipart) — see PostAdminSerializer (blog) for the same pattern/rationale."""

    translations = TeamMemberTranslationWriteSerializer(many=True)
    photo = serializers.ImageField(read_only=True)
    translation_model = TeamMemberTranslation
    translation_fk = "member"

    class Meta:
        model = TeamMember
        fields = ["id", "slug", "photo", "order", "is_active", "translations"]
