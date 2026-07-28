from rest_framework.routers import DefaultRouter

from .admin_views import TeamMemberAdminViewSet

router = DefaultRouter()
router.register("", TeamMemberAdminViewSet, basename="admin-team-member")

urlpatterns = router.urls
