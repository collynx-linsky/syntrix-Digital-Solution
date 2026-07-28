from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from apps.core.permissions import IsStaffUser

from .admin_serializers import ProjectAdminSerializer
from .models import Project


class ProjectAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD — /api/admin/portfolio/."""

    queryset = Project.objects.all().prefetch_related("translations")
    serializer_class = ProjectAdminSerializer
    permission_classes = [IsStaffUser]
    filterset_fields = ["industry", "is_featured"]

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser])
    def image(self, request, pk=None):
        """POST /api/admin/portfolio/{id}/image/ — multipart {image: File}."""
        project = self.get_object()
        image = request.FILES.get("image")
        if not image:
            return Response({"detail": "No image file provided."}, status=400)
        project.image = image
        project.save(update_fields=["image"])
        return Response(self.get_serializer(project).data)
