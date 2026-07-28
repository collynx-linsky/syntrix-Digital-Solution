from rest_framework import mixins, viewsets

from apps.core.permissions import IsStaffUser

from .admin_serializers import SubscriberAdminSerializer
from .models import Subscriber


class SubscriberAdminViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """List/retrieve/toggle-active/delete only — /api/admin/newsletter/subscribers/."""

    queryset = Subscriber.objects.all()
    serializer_class = SubscriberAdminSerializer
    permission_classes = [IsStaffUser]
    filterset_fields = ["is_active"]
