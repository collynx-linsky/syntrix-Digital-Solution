from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import TeamMember, TeamMemberTranslation


class TeamMemberTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMemberTranslation
        fields = ["language_code", "status", "name", "role", "bio"]


class TeamMemberSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ["id", "slug", "photo", "order", "translations"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return TeamMemberTranslationSerializer(published, many=True).data
