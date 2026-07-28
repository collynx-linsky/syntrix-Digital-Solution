from rest_framework.routers import DefaultRouter

from .admin_views import SolutionAdminViewSet

router = DefaultRouter()
router.register("", SolutionAdminViewSet, basename="admin-solution")

urlpatterns = router.urls
