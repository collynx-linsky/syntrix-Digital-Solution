from rest_framework import serializers

from .models import Subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["email", "language"]

    def create(self, validated_data):
        subscriber, _created = Subscriber.objects.update_or_create(
            email=validated_data["email"],
            defaults={"language": validated_data.get("language", ""), "is_active": True},
        )
        return subscriber
