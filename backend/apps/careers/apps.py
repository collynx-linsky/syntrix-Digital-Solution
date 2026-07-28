from django.apps import AppConfig


class CareersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.careers"
    label = "careers"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import JobPosition, JobPositionTranslation

        register_translatable(
            label="Job Positions",
            parent_model=JobPosition,
            translation_model=JobPositionTranslation,
            fk_name="position",
            display_field="title",
        )
