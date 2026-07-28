from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import Service, ServiceTranslation

ServiceTranslationInline = make_translation_inline(
    ServiceTranslation, extra_fields=("title", "summary", "description", "features"), fk_name="service"
)


@admin.register(Service)
class ServiceAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "order", "is_active", "translation_status", "updated_at")
    list_editable = ("order", "is_active")
    search_fields = ("slug",)
    inlines = [ServiceTranslationInline]
