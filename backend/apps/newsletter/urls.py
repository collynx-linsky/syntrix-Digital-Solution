from django.urls import path

from .views import SubscriberCreateView

urlpatterns = [
    path("subscribe/", SubscriberCreateView.as_view(), name="newsletter-subscribe"),
]
