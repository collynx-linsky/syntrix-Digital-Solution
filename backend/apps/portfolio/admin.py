from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import Project, ProjectTranslation

ProjectTranslationInline = make_translation_inline(
    ProjectTranslation, extra_fields=("title", "description"), fk_name="project"
)


@admin.register(Project)
class ProjectAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "client_name", "industry", "is_featured", "translation_status", "updated_at")
    list_filter = ("industry", "is_featured")
    search_fields = ("slug", "client_name")
    inlines = [ProjectTranslationInline]
