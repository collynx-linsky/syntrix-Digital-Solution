from rest_framework.routers import DefaultRouter

from .admin_views import ServiceAdminViewSet

router = DefaultRouter()
router.register("", ServiceAdminViewSet, basename="admin-service")

urlpatterns = router.urls
