from django.contrib import admin


def make_translation_inline(translation_model, extra_fields, fk_name="page"):
    """
    Factory for a TabularInline that lets an admin manage all four
    language rows (en/sw/fr/ar) for a translatable parent directly on its
    change page, instead of navigating to a separate translation list.
    `fk_name` must match the FK field name on `translation_model` that
    points back to the parent (e.g. "page", "service", "post").
    """
    parent_fk_name = fk_name  # avoid shadowing inside the class body below

    class TranslationInline(admin.TabularInline):
        model = translation_model
        fk_name = parent_fk_name
        extra = 0
        max_num = 4
        fields = ("language_code", "status", *extra_fields, "seo_title", "seo_description")

    return TranslationInline


class TranslationStatusAdminMixin:
    """
    Adds a compact per-language completeness column (e.g. "en✓ sw✓ fr⚠
    ar⚠") to any ModelAdmin for a translatable parent model, so editors
    can spot gaps from the list view without opening each record.
    """

    translation_related_name = "translations"

    @admin.display(description="Translations")
    def translation_status(self, obj):
        from apps.core.constants import LANGUAGE_CODES

        existing = set(
            getattr(obj, self.translation_related_name).values_list("language_code", flat=True)
        )
        return " ".join(f"{code}{'✓' if code in existing else '⚠'}" for code in LANGUAGE_CODES)
