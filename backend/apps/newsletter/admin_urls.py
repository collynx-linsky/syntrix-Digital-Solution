from rest_framework.routers import DefaultRouter

from .admin_views import SubscriberAdminViewSet

router = DefaultRouter()
router.register("subscribers", SubscriberAdminViewSet, basename="admin-newsletter-subscriber")

urlpatterns = router.urls
