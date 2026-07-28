from django.urls import path

from .admin_views import TranslationStatusView

urlpatterns = [
    path("translation-status/", TranslationStatusView.as_view(), name="admin-translation-status"),
]
