from django.apps import AppConfig


class PortfolioConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.portfolio"
    label = "portfolio"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import Project, ProjectTranslation

        register_translatable(
            label="Portfolio Projects",
            parent_model=Project,
            translation_model=ProjectTranslation,
            fk_name="project",
            display_field="title",
        )
