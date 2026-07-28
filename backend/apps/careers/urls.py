from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ApplicationCreateView, JobPositionViewSet

router = DefaultRouter()
router.register("", JobPositionViewSet, basename="job-position")

urlpatterns = [
    path("apply/", ApplicationCreateView.as_view(), name="job-application-create"),
    *router.urls,
]
