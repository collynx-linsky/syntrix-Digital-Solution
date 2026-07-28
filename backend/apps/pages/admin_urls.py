from rest_framework.routers import DefaultRouter

from .admin_views import PageAdminViewSet

router = DefaultRouter()
router.register("", PageAdminViewSet, basename="admin-page")

urlpatterns = router.urls
