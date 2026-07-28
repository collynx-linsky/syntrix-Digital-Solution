from django.contrib import admin

from apps.core.admin import TranslationStatusAdminMixin, make_translation_inline

from .models import TeamMember, TeamMemberTranslation

TeamMemberTranslationInline = make_translation_inline(
    TeamMemberTranslation, extra_fields=("name", "role", "bio"), fk_name="member"
)


@admin.register(TeamMember)
class TeamMemberAdmin(TranslationStatusAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "order", "is_active", "translation_status")
    list_editable = ("order", "is_active")
    inlines = [TeamMemberTranslationInline]
