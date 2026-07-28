from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import Service, ServiceTranslation


class ServiceTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = ServiceTranslation
        fields = ["language_code", "status", "title", "summary", "description", "features", "seo_title", "seo_description"]


class ServiceAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    translations = ServiceTranslationWriteSerializer(many=True)
    translation_model = ServiceTranslation
    translation_fk = "service"

    class Meta:
        model = Service
        fields = ["id", "slug", "icon", "order", "is_active", "translations"]
