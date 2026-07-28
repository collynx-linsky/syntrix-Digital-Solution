from rest_framework.routers import DefaultRouter

from .admin_views import GalleryImageAdminViewSet

router = DefaultRouter()
router.register("", GalleryImageAdminViewSet, basename="admin-gallery-image")

urlpatterns = router.urls
