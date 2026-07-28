from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render

from apps.core.translatable import build_translation_matrix


@staff_member_required
def translation_overview(request):
    """
    Renders the translation-completeness matrix described in the brief:

        Page: Homepage
        Languages: English ✓ Complete | Kiswahili ✓ Complete | French ⚠ Missing | Arabic ⚠ Missing

    One section per registered translatable model (Pages, Services,
    Solutions, Portfolio Projects, Blog Posts, Job Positions, Team
    Members), one row per parent object, one status cell per language.
    Status is "Complete" (a translation row exists and is published),
    "Draft/Review" (exists but not published), or "Missing". The matrix
    itself is built by apps.core.translatable.build_translation_matrix(),
    shared with the JSON endpoint used by the new /admin dashboard.
    """
    return render(request, "dashboard/translation_overview.html", {"sections": build_translation_matrix()})
