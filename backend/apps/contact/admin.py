from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "service", "language", "is_read", "created_at")
    list_filter = ("is_read", "language", "service")
    search_fields = ("name", "email", "message")
    readonly_fields = [f.name for f in ContactMessage._meta.fields if f.name != "is_read"]

    def has_add_permission(self, request):
        return False
