from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class Service(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)
    icon = models.CharField(max_length=50, blank=True, help_text="lucide-react icon name, e.g. 'code-2'")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "slug"]

    def __str__(self) -> str:
        return self.slug


class ServiceTranslation(BaseTranslation):
    service = models.ForeignKey(Service, related_name="translations", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    features = models.JSONField(default=list, blank=True, help_text="List of feature bullet strings.")

    class Meta:
        unique_together = ("service", "language_code")
        ordering = ["service", "language_code"]

    def __str__(self) -> str:
        return f"{self.service.slug} ({self.language_code})"
