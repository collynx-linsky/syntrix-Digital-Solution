from django.db import models

from .constants import LANGUAGE_CHOICES, TranslationStatus


class TimeStampedModel(models.Model):
    """Abstract base adding created/updated timestamps to any model."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseTranslation(TimeStampedModel):
    """
    Abstract base for every `<Model>Translation` table in the project.

    The pattern used throughout this codebase is "one parent row per
    language-independent entity + N translation rows" (one per supported
    language), e.g. Page/PageTranslation, Service/ServiceTranslation.
    This mirrors the ContentPage/PageTranslation structure requested for
    the multilingual CMS and keeps every translatable app consistent, so
    the admin translation dashboard (apps.dashboard) can introspect them
    generically via apps.core.translatable.TRANSLATABLE_REGISTRY.
    """

    language_code = models.CharField(max_length=5, choices=LANGUAGE_CHOICES)
    status = models.CharField(
        max_length=20, choices=TranslationStatus.CHOICES, default=TranslationStatus.DRAFT
    )
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=160, blank=True)

    class Meta:
        abstract = True

    @property
    def is_published(self) -> bool:
        return self.status == TranslationStatus.PUBLISHED
