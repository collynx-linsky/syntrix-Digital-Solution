from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from apps.core.permissions import IsStaffUser

from .admin_serializers import GalleryImageAdminSerializer
from .models import GalleryImage


class GalleryImageAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (inactive included) — /api/admin/gallery/."""

    queryset = GalleryImage.objects.all().prefetch_related("translations")
    serializer_class = GalleryImageAdminSerializer
    permission_classes = [IsStaffUser]

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser])
    def image(self, request, pk=None):
        """POST /api/admin/gallery/{id}/image/ — multipart {image: File}."""
        gallery_image = self.get_object()
        image = request.FILES.get("image")
        if not image:
            return Response({"detail": "No image file provided."}, status=400)
        gallery_image.image = image
        gallery_image.save(update_fields=["image"])
        return Response(self.get_serializer(gallery_image).data)
