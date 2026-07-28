from rest_framework import mixins, viewsets

from apps.core.permissions import IsStaffUser

from .admin_serializers import ApplicationAdminSerializer, JobPositionAdminSerializer
from .models import Application, JobPosition


class JobPositionAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (inactive included) — /api/admin/careers/positions/."""

    queryset = JobPosition.objects.all().prefetch_related("translations")
    serializer_class = JobPositionAdminSerializer
    permission_classes = [IsStaffUser]


class ApplicationAdminViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """List/retrieve/delete only — /api/admin/careers/applications/. No
    create/update: applications only ever come from the public /apply/
    endpoint. `resume` serializes to an absolute download URL."""

    queryset = Application.objects.all().select_related("position")
    serializer_class = ApplicationAdminSerializer
    permission_classes = [IsStaffUser]
    filterset_fields = ["position"]
