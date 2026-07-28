from django.apps import AppConfig


class ServicesCatalogConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.services_catalog"
    label = "services_catalog"
    verbose_name = "Services"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import Service, ServiceTranslation

        register_translatable(
            label="Services",
            parent_model=Service,
            translation_model=ServiceTranslation,
            fk_name="service",
            display_field="title",
        )
