from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import Application, JobPosition, JobPositionTranslation

JobPositionTranslationInline = make_translation_inline(
    JobPositionTranslation, extra_fields=("title", "summary", "description"), fk_name="position"
)


@admin.register(JobPosition)
class JobPositionAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "department", "location", "employment_type", "is_active", "translation_status")
    list_filter = ("department", "employment_type", "is_active")
    inlines = [JobPositionTranslationInline]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "position", "language", "created_at")
    list_filter = ("position", "language")
    search_fields = ("full_name", "email")
    readonly_fields = [f.name for f in Application._meta.fields]

    def has_add_permission(self, request):
        return False
