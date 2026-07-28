from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import AdminTokenObtainPairSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


class MeView(APIView):
    """
    GET /api/auth/me/ — permission is IsAuthenticated, not IsStaffUser, so
    a valid login that isn't staff gets a clear {"is_staff": false} instead
    of an opaque 401/redirect loop; the frontend decides what to do with it.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.get_username(),
            "email": user.email,
            "is_staff": user.is_staff,
        })
