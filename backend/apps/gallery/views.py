from rest_framework import viewsets

from .models import GalleryImage
from .serializers import GalleryImageSerializer


class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.filter(is_active=True).prefetch_related("translations")
    serializer_class = GalleryImageSerializer
    lookup_field = "slug"
