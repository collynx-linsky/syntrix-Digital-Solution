from rest_framework import viewsets

from .models import Page
from .serializers import PageSerializer


class PageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only API: GET /api/pages/ and /api/pages/<slug>/.
    Write access is intentionally admin-only (via Django Admin), matching
    the "translation management interface" described in the brief rather
    than exposing a public write API for page content.
    """

    queryset = Page.objects.filter(is_published=True).prefetch_related("translations")
    serializer_class = PageSerializer
    lookup_field = "slug"
