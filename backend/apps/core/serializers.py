from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Adds is_staff/username claims to the JWT so the frontend's edge
    middleware can do a cheap UX-level authorization check (redirect,
    show/hide nav) without a round trip to /api/auth/me/ on every request.
    Real authorization is always enforced server-side by IsStaffUser on
    each /api/admin/... endpoint regardless of what these claims say.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_staff"] = user.is_staff
        token["username"] = user.get_username()
        return token


class WritableTranslationSerializer(serializers.ModelSerializer):
    """
    Base for admin-facing <X>TranslationSerializer classes used as the
    nested `translations` field on a TranslationUpsertMixin serializer.
    Subclasses just set Meta.model/fields (language_code, status, the
    model's own content fields, seo_title, seo_description).
    """


class TranslationUpsertMixin:
    """
    Mixin for admin-facing parent serializers with a writable nested
    `translations` list (one row per language). Subclasses set
    `translation_model` and `translation_fk` (the FK field name on
    translation_model pointing back to the parent — matches
    apps.core.translatable.TranslatableEntry.fk_name). Mirrors the
    apps.core.admin.make_translation_inline() factoring used for Django
    admin, but for DRF: one shared upsert instead of a near-identical
    create/update pair per app.
    """

    translation_model = None
    translation_fk = None

    def validate_translations(self, value):
        codes = [row["language_code"] for row in value]
        if len(codes) != len(set(codes)):
            raise serializers.ValidationError("Duplicate language_code in translations.")
        return value

    def _upsert_translations(self, parent, translations_data):
        for row in translations_data:
            row = dict(row)
            lang = row.pop("language_code")
            lookup = {self.translation_fk: parent, "language_code": lang}
            self.translation_model.objects.update_or_create(defaults=row, **lookup)

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        parent = super().create(validated_data)
        self._upsert_translations(parent, translations_data)
        return parent

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        if translations_data is not None:
            self._upsert_translations(instance, translations_data)
        return instance
