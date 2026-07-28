from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import Page, PageTranslation

PageTranslationInline = make_translation_inline(
    PageTranslation, extra_fields=("title", "subtitle"), fk_name="page"
)


@admin.register(Page)
class PageAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "is_published", "translation_status", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("slug",)
    inlines = [PageTranslationInline]
