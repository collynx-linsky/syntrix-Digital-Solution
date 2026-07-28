from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class Solution(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)
    icon = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "slug"]

    def __str__(self) -> str:
        return self.slug


class SolutionTranslation(BaseTranslation):
    solution = models.ForeignKey(Solution, related_name="translations", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    capabilities = models.JSONField(default=list, blank=True)

    class Meta:
        unique_together = ("solution", "language_code")
        ordering = ["solution", "language_code"]

    def __str__(self) -> str:
        return f"{self.solution.slug} ({self.language_code})"
