from rest_framework import viewsets

from apps.core.permissions import IsStaffUser

from .admin_serializers import PageAdminSerializer
from .models import Page


class PageAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (unpublished pages included) — /api/admin/pages/."""

    queryset = Page.objects.all().prefetch_related("translations")
    serializer_class = PageAdminSerializer
    permission_classes = [IsStaffUser]
