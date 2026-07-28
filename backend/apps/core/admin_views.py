from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsStaffUser
from .translatable import build_translation_matrix


class TranslationStatusView(APIView):
    """GET /api/admin/dashboard/translation-status/ — JSON version of the
    legacy apps.dashboard translation_overview HTML page, for the new
    admin panel's dashboard home."""

    permission_classes = [IsStaffUser]

    def get(self, request):
        return Response({"sections": build_translation_matrix()})
