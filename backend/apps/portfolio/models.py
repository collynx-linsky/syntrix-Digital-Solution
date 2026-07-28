from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class Project(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)
    client_name = models.CharField(max_length=150)
    industry = models.CharField(max_length=100)
    technologies = models.JSONField(default=list, blank=True, help_text="List of technology name strings.")
    image = models.ImageField(upload_to="portfolio/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self) -> str:
        return f"{self.slug} ({self.client_name})"


class ProjectTranslation(BaseTranslation):
    project = models.ForeignKey(Project, related_name="translations", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        unique_together = ("project", "language_code")
        ordering = ["project", "language_code"]

    def __str__(self) -> str:
        return f"{self.project.slug} ({self.language_code})"
