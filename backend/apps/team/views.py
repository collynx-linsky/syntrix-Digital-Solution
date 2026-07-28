from rest_framework import viewsets

from .models import TeamMember
from .serializers import TeamMemberSerializer


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_active=True).prefetch_related("translations")
    serializer_class = TeamMemberSerializer
    lookup_field = "slug"
