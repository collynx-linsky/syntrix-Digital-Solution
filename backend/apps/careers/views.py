from rest_framework import permissions, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.throttling import AnonRateThrottle

from .models import JobPosition
from .serializers import ApplicationSerializer, JobPositionSerializer


class JobPositionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobPosition.objects.filter(is_active=True).prefetch_related("translations")
    serializer_class = JobPositionSerializer
    lookup_field = "slug"


class ApplicationRateThrottle(AnonRateThrottle):
    scope = "application"


class ApplicationCreateView(CreateAPIView):
    """POST /api/careers/apply/ — public endpoint, accepts multipart form data with a resume file."""

    serializer_class = ApplicationSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ApplicationRateThrottle]
