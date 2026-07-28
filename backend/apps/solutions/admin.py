from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import Solution, SolutionTranslation

SolutionTranslationInline = make_translation_inline(
    SolutionTranslation, extra_fields=("title", "summary", "description", "capabilities"), fk_name="solution"
)


@admin.register(Solution)
class SolutionAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "order", "is_active", "translation_status", "updated_at")
    list_editable = ("order", "is_active")
    search_fields = ("slug",)
    inlines = [SolutionTranslationInline]
