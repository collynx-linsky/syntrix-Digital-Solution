from rest_framework import viewsets

from apps.core.permissions import IsStaffUser

from .admin_serializers import SolutionAdminSerializer
from .models import Solution


class SolutionAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (inactive included) — /api/admin/solutions/."""

    queryset = Solution.objects.all().prefetch_related("translations")
    serializer_class = SolutionAdminSerializer
    permission_classes = [IsStaffUser]
