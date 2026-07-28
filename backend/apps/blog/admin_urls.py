from rest_framework.routers import DefaultRouter

from .admin_views import CategoryAdminViewSet, PostAdminViewSet

router = DefaultRouter()
router.register("categories", CategoryAdminViewSet, basename="admin-blog-category")
router.register("posts", PostAdminViewSet, basename="admin-blog-post")

urlpatterns = router.urls
