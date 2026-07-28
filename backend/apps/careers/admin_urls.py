from rest_framework.routers import DefaultRouter

from .admin_views import ApplicationAdminViewSet, JobPositionAdminViewSet

router = DefaultRouter()
router.register("positions", JobPositionAdminViewSet, basename="admin-job-position")
router.register("applications", ApplicationAdminViewSet, basename="admin-application")

urlpatterns = router.urls
