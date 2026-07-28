from django.conf import settings
from django.db import models

from apps.core.models import BaseTranslation, TimeStampedModel


class Category(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["slug"]

    def __str__(self) -> str:
        return self.slug


class CategoryTranslation(BaseTranslation):
    category = models.ForeignKey(Category, related_name="translations", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("category", "language_code")

    def __str__(self) -> str:
        return f"{self.category.slug} ({self.language_code})"


class Post(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=150)
    category = models.ForeignKey(Category, related_name="posts", on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    cover_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    read_time_minutes = models.PositiveSmallIntegerField(default=5)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.slug


class PostTranslation(BaseTranslation):
    post = models.ForeignKey(Post, related_name="translations", on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    excerpt = models.CharField(max_length=300)
    content = models.TextField(blank=True)

    class Meta:
        unique_together = ("post", "language_code")
        ordering = ["post", "language_code"]

    def __str__(self) -> str:
        return f"{self.post.slug} ({self.language_code})"
