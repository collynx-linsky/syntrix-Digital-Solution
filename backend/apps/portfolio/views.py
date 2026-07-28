from rest_framework import viewsets

from apps.core.constants import TranslationStatus

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    # Unlike Post, Project has no parent-level is_published field — gate on
    # having at least one published translation instead, so draft-only
    # projects don't leak onto the public site.
    queryset = (
        Project.objects.filter(translations__status=TranslationStatus.PUBLISHED)
        .distinct()
        .prefetch_related("translations")
    )
    serializer_class = ProjectSerializer
    lookup_field = "slug"
    filterset_fields = ["industry", "is_featured"]
