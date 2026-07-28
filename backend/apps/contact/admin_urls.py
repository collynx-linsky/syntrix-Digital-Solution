from rest_framework.routers import DefaultRouter

from .admin_views import ContactMessageAdminViewSet

router = DefaultRouter()
router.register("messages", ContactMessageAdminViewSet, basename="admin-contact-message")

urlpatterns = router.urls
