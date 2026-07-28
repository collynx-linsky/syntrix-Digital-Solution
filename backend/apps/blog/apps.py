from django.apps import AppConfig


class BlogConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.blog"
    label = "blog"

    def ready(self):
        from apps.core.translatable import register_translatable

        from .models import Post, PostTranslation

        register_translatable(
            label="Blog Posts",
            parent_model=Post,
            translation_model=PostTranslation,
            fk_name="post",
            display_field="title",
        )
