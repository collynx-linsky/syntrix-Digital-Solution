from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.core.views import AdminTokenObtainPairView, MeView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("dashboard/", include("apps.dashboard.urls")),
    path("api/auth/token/", AdminTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="auth-me"),
    path("api/pages/", include("apps.pages.urls")),
    path("api/services/", include("apps.services_catalog.urls")),
    path("api/solutions/", include("apps.solutions.urls")),
    path("api/portfolio/", include("apps.portfolio.urls")),
    path("api/blog/", include("apps.blog.urls")),
    path("api/careers/", include("apps.careers.urls")),
    path("api/contact/", include("apps.contact.urls")),
    path("api/newsletter/", include("apps.newsletter.urls")),
    path("api/team/", include("apps.team.urls")),
    path("api/gallery/", include("apps.gallery.urls")),
    # Staff-only write API for the /admin dashboard (Next.js frontend).
    path("api/admin/pages/", include("apps.pages.admin_urls")),
    path("api/admin/blog/", include("apps.blog.admin_urls")),
    path("api/admin/portfolio/", include("apps.portfolio.admin_urls")),
    path("api/admin/contact/", include("apps.contact.admin_urls")),
    path("api/admin/newsletter/", include("apps.newsletter.admin_urls")),
    path("api/admin/services/", include("apps.services_catalog.admin_urls")),
    path("api/admin/solutions/", include("apps.solutions.admin_urls")),
    path("api/admin/team/", include("apps.team.admin_urls")),
    path("api/admin/careers/", include("apps.careers.admin_urls")),
    path("api/admin/gallery/", include("apps.gallery.admin_urls")),
    path("api/admin/dashboard/", include("apps.core.admin_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
