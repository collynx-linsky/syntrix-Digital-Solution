from rest_framework import viewsets

from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().prefetch_related("translations")
    serializer_class = CategorySerializer
    lookup_field = "slug"


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.filter(is_published=True).select_related("category").prefetch_related("translations")
    serializer_class = PostSerializer
    lookup_field = "slug"
    filterset_fields = ["category__slug"]
