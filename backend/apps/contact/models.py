from apps.core.constants import LANGUAGE_CHOICES
from apps.core.models import TimeStampedModel
from django.db import models


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    company = models.CharField(max_length=150, blank=True)
    service = models.CharField(max_length=100, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, blank=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"
