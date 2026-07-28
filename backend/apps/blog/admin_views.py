from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from apps.core.permissions import IsStaffUser

from .admin_serializers import CategoryAdminSerializer, PostAdminSerializer
from .models import Category, Post


class CategoryAdminViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().prefetch_related("translations")
    serializer_class = CategoryAdminSerializer
    permission_classes = [IsStaffUser]


class PostAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD, unfiltered (drafts included) — /api/admin/blog/posts/."""

    queryset = Post.objects.all().select_related("category").prefetch_related("translations")
    serializer_class = PostAdminSerializer
    permission_classes = [IsStaffUser]

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser])
    def image(self, request, pk=None):
        """POST /api/admin/blog/posts/{id}/image/ — multipart {image: File}."""
        post = self.get_object()
        image = request.FILES.get("image")
        if not image:
            return Response({"detail": "No image file provided."}, status=400)
        post.cover_image = image
        post.save(update_fields=["cover_image"])
        return Response(self.get_serializer(post).data)
