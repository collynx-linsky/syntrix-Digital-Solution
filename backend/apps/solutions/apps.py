from django.apps import AppConfig


class SolutionsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.solutions"
    label = "solutions"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import Solution, SolutionTranslation

        register_translatable(
            label="Solutions",
            parent_model=Solution,
            translation_model=SolutionTranslation,
            fk_name="solution",
            display_field="title",
        )
