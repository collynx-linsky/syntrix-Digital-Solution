from rest_framework import serializers

from .models import Subscriber


class SubscriberAdminSerializer(serializers.ModelSerializer):
    """Everything read-only except is_active — no admin-created subscribers."""

    class Meta:
        model = Subscriber
        fields = ["id", "email", "language", "is_active", "created_at"]
        read_only_fields = ["id", "email", "language", "created_at"]
