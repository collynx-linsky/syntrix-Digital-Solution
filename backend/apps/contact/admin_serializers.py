from rest_framework import serializers

from .models import ContactMessage


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    """Everything read-only except is_read — no admin-created messages,
    matches the existing ContactMessageAdmin (Django admin) behavior."""

    class Meta:
        model = ContactMessage
        fields = [
            "id", "name", "email", "phone", "company", "service",
            "budget", "message", "language", "is_read", "created_at",
        ]
        read_only_fields = [
            "id", "name", "email", "phone", "company", "service",
            "budget", "message", "language", "created_at",
        ]
