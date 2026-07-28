from rest_framework import viewsets

from .models import Solution
from .serializers import SolutionSerializer


class SolutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Solution.objects.filter(is_active=True).prefetch_related("translations")
    serializer_class = SolutionSerializer
    lookup_field = "slug"
