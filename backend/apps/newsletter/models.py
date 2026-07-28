from apps.core.constants import LANGUAGE_CHOICES
from apps.core.models import TimeStampedModel
from django.db import models


class Subscriber(TimeStampedModel):
    email = models.EmailField(unique=True)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email
