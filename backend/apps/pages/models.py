from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class Page(TimeStampedModel):
    """
    A language-independent content page (e.g. Homepage, About). Structured
    content for each page currently lives in the frontend's message
    catalogs (frontend/src/messages/<locale>/*.json) for performance and
    static generation; this model is the CMS-side mirror described in the
    brief (Page -> PageTranslation, one row per language) so an admin can
    eventually manage page copy without a code deploy. A future sync job
    or direct API consumption from the frontend can replace the static
    JSON catalogs with this table without changing the schema.
    """

    slug = models.SlugField(unique=True, max_length=100)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["slug"]

    def __str__(self) -> str:
        return self.slug


class PageTranslation(BaseTranslation):
    page = models.ForeignKey(Page, related_name="translations", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    content = models.TextField(blank=True, help_text="Rich text / block content for this page.")
    sections = models.JSONField(
        blank=True,
        default=dict,
        help_text="Structured section content for template-driven pages (e.g. homepage, about).",
    )

    class Meta:
        unique_together = ("page", "language_code")
        ordering = ["page", "language_code"]

    def __str__(self) -> str:
        return f"{self.page.slug} ({self.language_code})"
