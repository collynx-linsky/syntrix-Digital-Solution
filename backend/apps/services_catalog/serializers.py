from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Service, ServiceTranslation


class ServiceTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTranslation
        fields = ["language_code", "status", "title", "summary", "description", "features", "seo_title", "seo_description"]


class ServiceSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ["id", "slug", "icon", "order", "is_active", "translations"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return ServiceTranslationSerializer(published, many=True).data
