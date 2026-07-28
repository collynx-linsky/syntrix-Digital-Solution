from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class JobPosition(TimeStampedModel):
    class EmploymentType(models.TextChoices):
        FULL_TIME = "full_time", "Full-time"
        PART_TIME = "part_time", "Part-time"
        CONTRACT = "contract", "Contract"
        INTERNSHIP = "internship", "Internship"

    slug = models.SlugField(unique=True, max_length=150)
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=150)
    employment_type = models.CharField(max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-is_active", "-created_at"]

    def __str__(self) -> str:
        return self.slug


class JobPositionTranslation(BaseTranslation):
    position = models.ForeignKey(JobPosition, related_name="translations", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("position", "language_code")
        ordering = ["position", "language_code"]

    def __str__(self) -> str:
        return f"{self.position.slug} ({self.language_code})"


class Application(TimeStampedModel):
    position = models.ForeignKey(JobPosition, related_name="applications", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    linkedin = models.URLField(blank=True)
    cover_message = models.TextField()
    resume = models.FileField(upload_to="applications/resumes/")
    consent = models.BooleanField(default=False)
    language = models.CharField(max_length=5, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} -> {self.position.slug}"
