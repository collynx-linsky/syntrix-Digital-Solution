from django.contrib import admin

from .models import Subscriber


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "language", "is_active", "created_at")
    list_filter = ("is_active", "language")
    search_fields = ("email",)
