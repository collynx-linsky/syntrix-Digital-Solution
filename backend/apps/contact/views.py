from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from rest_framework.throttling import AnonRateThrottle

from .serializers import ContactMessageSerializer


class ContactRateThrottle(AnonRateThrottle):
    scope = "contact"
    rate = "5/hour"


class ContactMessageCreateView(CreateAPIView):
    """POST /api/contact/ — public endpoint used by the website contact form."""

    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactRateThrottle]
