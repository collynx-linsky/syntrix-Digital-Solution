from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class TeamMember(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.slug


class TeamMemberTranslation(BaseTranslation):
    member = models.ForeignKey(TeamMember, related_name="translations", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio = models.TextField(blank=True)

    class Meta:
        unique_together = ("member", "language_code")
        ordering = ["member", "language_code"]

    def __str__(self) -> str:
        return f"{self.member.slug} ({self.language_code})"
