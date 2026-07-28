from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from rest_framework.throttling import AnonRateThrottle

from .serializers import SubscriberSerializer


class NewsletterRateThrottle(AnonRateThrottle):
    scope = "newsletter"


class SubscriberCreateView(CreateAPIView):
    """POST /api/newsletter/subscribe/ — re-subscribing with the same email reactivates it."""

    serializer_class = SubscriberSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [NewsletterRateThrottle]
