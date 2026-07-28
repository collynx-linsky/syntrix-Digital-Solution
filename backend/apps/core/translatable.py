"""
Lightweight registry so the translation-management dashboard
(apps.dashboard) and the `detect_missing_translations` management command
can introspect every translatable model in the project without importing
each app's models directly (which would create app-loading circular
imports). Each translatable app registers itself once, in its AppConfig's
`ready()` — see apps/pages/apps.py for the canonical example.
"""

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class TranslatableEntry:
    label: str  # human-readable name shown in the dashboard, e.g. "Services"
    parent_model: Any  # the language-independent model, e.g. Service
    translation_model: Any  # the per-language model, e.g. ServiceTranslation
    fk_name: str = "parent"  # FK field name on translation_model pointing back to parent
    display_field: str = "title"  # field used to label a parent row in the dashboard


_REGISTRY: list[TranslatableEntry] = []


def register_translatable(**kwargs: Any) -> None:
    _REGISTRY.append(TranslatableEntry(**kwargs))


def get_translatable_registry() -> list[TranslatableEntry]:
    return list(_REGISTRY)


def _admin_change_url(obj):
    from django.urls import NoReverseMatch, reverse

    opts = obj._meta
    try:
        return reverse(f"admin:{opts.app_label}_{opts.model_name}_change", args=[obj.pk])
    except NoReverseMatch:
        return None


def build_translation_matrix() -> list[dict]:
    """
    Builds the translation-completeness matrix shared by the legacy
    server-rendered dashboard (apps.dashboard.views.translation_overview)
    and the JSON endpoint used by the new admin panel
    (apps.core.admin_views.TranslationStatusView).
    """
    from .constants import LANGUAGE_CHOICES

    sections = []
    for entry in get_translatable_registry():
        rows = []
        for parent in entry.parent_model.objects.all():
            translations = {
                t.language_code: t
                for t in entry.translation_model.objects.filter(**{entry.fk_name: parent})
            }
            cells = []
            for code, label in LANGUAGE_CHOICES:
                translation = translations.get(code)
                if translation is None:
                    cells.append({"code": code, "label": label, "state": "missing", "text": "Missing"})
                elif getattr(translation, "is_published", False):
                    cells.append({"code": code, "label": label, "state": "complete", "text": "Complete"})
                else:
                    cells.append({"code": code, "label": label, "state": "draft", "text": translation.get_status_display()})

            rows.append({
                "label": getattr(parent, entry.display_field, None) or str(parent),
                "admin_url": _admin_change_url(parent),
                "cells": cells,
            })

        sections.append({"label": entry.label, "rows": rows})

    return sections
