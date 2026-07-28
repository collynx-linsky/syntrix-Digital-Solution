from rest_framework import viewsets

from apps.core.permissions import IsStaffUser

from .admin_serializers import ServiceAdminSerializer
from .models import Service


class ServiceAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (inactive included) — /api/admin/services/."""

    queryset = Service.objects.all().prefetch_related("translations")
    serializer_class = ServiceAdminSerializer
    permission_classes = [IsStaffUser]
