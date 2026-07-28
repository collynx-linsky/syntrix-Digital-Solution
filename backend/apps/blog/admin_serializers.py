from rest_framework import serializers

from apps.core.serializers import TranslationUpsertMixin, WritableTranslationSerializer

from .models import Category, CategoryTranslation, Post, PostTranslation


class CategoryTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = CategoryTranslation
        fields = ["language_code", "status", "name", "seo_title", "seo_description"]


class CategoryAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    translations = CategoryTranslationWriteSerializer(many=True)
    translation_model = CategoryTranslation
    translation_fk = "category"

    class Meta:
        model = Category
        fields = ["id", "slug", "translations"]


class PostTranslationWriteSerializer(WritableTranslationSerializer):
    class Meta:
        model = PostTranslation
        fields = ["language_code", "status", "title", "excerpt", "content", "seo_title", "seo_description"]


class PostAdminSerializer(TranslationUpsertMixin, serializers.ModelSerializer):
    """
    cover_image is read-only here: image uploads go through the dedicated
    PostAdminViewSet.image action (multipart), so this serializer stays
    pure JSON and the writable nested `translations` array works without
    the JSON-in-multipart workarounds that mixing the two would require.
    """

    translations = PostTranslationWriteSerializer(many=True)
    cover_image = serializers.ImageField(read_only=True)
    translation_model = PostTranslation
    translation_fk = "post"

    class Meta:
        model = Post
        fields = [
            "id", "slug", "category", "cover_image", "read_time_minutes",
            "is_published", "published_at", "translations",
        ]
