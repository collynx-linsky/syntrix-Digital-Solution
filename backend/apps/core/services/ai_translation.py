"""
AI Translation Assistant — pluggable interface.

This module defines the contract the admin dashboard and management
commands use to request machine-generated translation drafts, tone-aware
suggestions, and missing-translation detection. It intentionally ships
without a wired-up LLM provider: no API key is configured in this
environment, and the human-review workflow (status: draft -> under_review
-> published, see apps.core.constants.TranslationStatus) is designed so
that AI output is never published without a person approving it.

To activate, implement `AITranslationProvider` against a real LLM API
(e.g. the Anthropic Messages API) and set AI_TRANSLATION_PROVIDER in
settings to point at it. Everything upstream (admin actions, the
`generate_translation_draft` management command) already calls through
this interface, so no other code needs to change.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class TranslationDraft:
    text: str
    source_language: str
    target_language: str
    confidence_note: str = (
        "Machine-generated draft. Requires human review before publishing."
    )


class AITranslationProvider(ABC):
    @abstractmethod
    def generate_draft(self, text: str, source_language: str, target_language: str) -> TranslationDraft:
        """Produce a first-pass translation of `text` into `target_language`."""

    @abstractmethod
    def suggest_improvements(self, text: str, language: str, brand_tone_notes: str = "") -> list[str]:
        """Return a list of suggested edits to tighten tone/clarity/brand voice."""


class NullAITranslationProvider(AITranslationProvider):
    """
    Default no-op provider. Raises clearly instead of silently returning
    fake data, so missing configuration fails loudly in the admin rather
    than shipping garbage translations.
    """

    def generate_draft(self, text: str, source_language: str, target_language: str) -> TranslationDraft:
        raise NotImplementedError(
            "No AI translation provider is configured. Set AI_TRANSLATION_PROVIDER "
            "in settings to a class implementing AITranslationProvider."
        )

    def suggest_improvements(self, text: str, language: str, brand_tone_notes: str = "") -> list[str]:
        raise NotImplementedError(
            "No AI translation provider is configured. Set AI_TRANSLATION_PROVIDER "
            "in settings to a class implementing AITranslationProvider."
        )


def get_ai_translation_provider() -> AITranslationProvider:
    from django.conf import settings
    from django.utils.module_loading import import_string

    path = getattr(settings, "AI_TRANSLATION_PROVIDER", None)
    if not path:
        return NullAITranslationProvider()
    provider_class = import_string(path)
    return provider_class()
