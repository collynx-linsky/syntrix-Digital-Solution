from django.urls import path

from .views import translation_overview

urlpatterns = [
    path("translations/", translation_overview, name="translation-overview"),
]
