from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from apps.core.permissions import IsStaffUser

from .admin_serializers import TeamMemberAdminSerializer
from .models import TeamMember


class TeamMemberAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (inactive included) — /api/admin/team/."""

    queryset = TeamMember.objects.all().prefetch_related("translations")
    serializer_class = TeamMemberAdminSerializer
    permission_classes = [IsStaffUser]

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser])
    def photo(self, request, pk=None):
        """POST /api/admin/team/{id}/photo/ — multipart {image: File}."""
        member = self.get_object()
        image = request.FILES.get("image")
        if not image:
            return Response({"detail": "No image file provided."}, status=400)
        member.photo = image
        member.save(update_fields=["photo"])
        return Response(self.get_serializer(member).data)
