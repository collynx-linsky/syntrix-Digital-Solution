from django.apps import AppConfig


class PagesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.pages"
    label = "pages"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import Page, PageTranslation

        register_translatable(
            label="Pages",
            parent_model=Page,
            translation_model=PageTranslation,
            fk_name="page",
            display_field="title",
        )
