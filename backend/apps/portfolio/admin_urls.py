from rest_framework.routers import DefaultRouter

from .admin_views import ProjectAdminViewSet

router = DefaultRouter()
router.register("", ProjectAdminViewSet, basename="admin-project")

urlpatterns = router.urls
