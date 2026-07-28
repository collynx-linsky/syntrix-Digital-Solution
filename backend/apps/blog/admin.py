from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import Category, CategoryTranslation, Post, PostTranslation

CategoryTranslationInline = make_translation_inline(
    CategoryTranslation, extra_fields=("name",), fk_name="category"
)
PostTranslationInline = make_translation_inline(
    PostTranslation, extra_fields=("title", "excerpt", "content"), fk_name="post"
)


@admin.register(Category)
class CategoryAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "translation_status")
    inlines = [CategoryTranslationInline]


@admin.register(Post)
class PostAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "category", "author", "is_published", "published_at", "translation_status")
    list_filter = ("category", "is_published")
    search_fields = ("slug",)
    inlines = [PostTranslationInline]
