"""
Single source of truth for supported content languages on the backend.
Mirrors frontend/src/i18n/locales.ts by convention — adding a language
requires updating both files plus running migrations for any translation
tables that enforce LANGUAGE_CHOICES at the database level (none currently
do; the choices are enforced at the form/serializer layer only, so the
list can grow without a schema migration).
"""

LANGUAGE_CHOICES = [
    ("en", "English"),
    ("sw", "Kiswahili"),
    ("fr", "Français"),
    ("ar", "العربية"),
]

LANGUAGE_CODES = [code for code, _ in LANGUAGE_CHOICES]
DEFAULT_LANGUAGE = "en"
RTL_LANGUAGES = {"ar"}


class TranslationStatus:
    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    PUBLISHED = "published"

    CHOICES = [
        (DRAFT, "Draft"),
        (UNDER_REVIEW, "Under Review"),
        (PUBLISHED, "Published"),
    ]
