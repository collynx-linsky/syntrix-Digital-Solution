from django.apps import AppConfig


class TeamConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.team"
    label = "team"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import TeamMember, TeamMemberTranslation

        register_translatable(
            label="Team Members",
            parent_model=TeamMember,
            translation_model=TeamMemberTranslation,
            fk_name="member",
            display_field="name",
        )
