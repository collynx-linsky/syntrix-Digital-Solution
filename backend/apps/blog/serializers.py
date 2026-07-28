from rest_framework import serializers

from apps.core.constants import TranslationStatus

from .models import Category, CategoryTranslation, Post, PostTranslation


class CategoryTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryTranslation
        fields = ["language_code", "status", "name"]


class CategorySerializer(serializers.ModelSerializer):
    # SerializerMethodField (not a plain nested serializer) so we can filter
    # to published-only translations without a second query — obj.translations.all()
    # reuses the view's .prefetch_related("translations"), a .filter() call wouldn't.
    translations = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "slug", "translations"]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return CategoryTranslationSerializer(published, many=True).data


class PostTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostTranslation
        fields = ["language_code", "status", "title", "excerpt", "content", "seo_title", "seo_description"]


class PostSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "slug", "category", "cover_image", "read_time_minutes",
            "published_at", "translations",
        ]

    def get_translations(self, obj):
        published = [t for t in obj.translations.all() if t.status == TranslationStatus.PUBLISHED]
        return PostTranslationSerializer(published, many=True).data
