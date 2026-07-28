from rest_framework import mixins, viewsets

from apps.core.permissions import IsStaffUser

from .admin_serializers import ContactMessageAdminSerializer
from .models import ContactMessage


class ContactMessageAdminViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """List/retrieve/mark-read/delete only — /api/admin/contact/messages/.
    No create (messages only ever come from the public contact form)."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsStaffUser]
    filterset_fields = ["is_read"]
