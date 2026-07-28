from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """Gate for the /api/admin/... write API. This is the only check that
    actually matters for security — any UI-level staff check on the
    frontend (e.g. reading the is_staff claim in middleware) is a UX
    fast-path only and must not be relied upon on its own."""

    message = "Staff access required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
