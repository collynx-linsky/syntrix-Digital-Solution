from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, PostViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="blog-category")
router.register("posts", PostViewSet, basename="blog-post")

urlpatterns = router.urls
