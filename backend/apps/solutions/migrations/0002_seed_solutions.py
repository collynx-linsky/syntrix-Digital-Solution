import json
from pathlib import Path

from django.db import migrations

# lucide-react icon name (kebab-case) per slug — matches what the public
# solutions pages originally hardcoded before becoming DB-driven.
ICONS = {
    "education-technology": "graduation-cap",
    "business-automation": "workflow",
    "enterprise-systems": "building-2",
    "ai-solutions": "bot",
}

LOCALES = ["en", "sw", "fr", "ar"]


def _load_items_by_locale():
    """Reads the pre-existing, already-translated static content from the
    frontend's messages/*/solutions.json (source of truth before this app
    became DB-driven) so it can seed real starting rows instead of leaving
    the admin panel empty. Best-effort: if the frontend tree isn't present
    (e.g. a backend-only deploy checkout), seeding is silently skipped —
    this is additive, one-time convenience, not a hard dependency."""
    root = Path(__file__).resolve().parents[4]
    messages_dir = root / "frontend" / "src" / "messages"
    result = {}
    for locale in LOCALES:
        path = messages_dir / locale / "solutions.json"
        try:
            with open(path, encoding="utf-8") as f:
                result[locale] = json.load(f)["items"]
        except (OSError, KeyError, json.JSONDecodeError):
            return None
    return result


def seed_solutions(apps, schema_editor):
    items_by_locale = _load_items_by_locale()
    if items_by_locale is None:
        return

    Solution = apps.get_model("solutions", "Solution")
    SolutionTranslation = apps.get_model("solutions", "SolutionTranslation")

    en_items = items_by_locale["en"]
    for order, en_item in enumerate(en_items):
        slug = en_item["slug"]
        solution, _ = Solution.objects.get_or_create(
            slug=slug,
            defaults={"icon": ICONS.get(slug, ""), "order": order, "is_active": True},
        )

        for locale in LOCALES:
            item = next((i for i in items_by_locale[locale] if i["slug"] == slug), None)
            if item is None:
                continue
            SolutionTranslation.objects.get_or_create(
                solution=solution,
                language_code=locale,
                defaults={
                    "status": "published",
                    "title": item["title"],
                    "summary": item["summary"],
                    "description": item["description"],
                    "capabilities": item["capabilities"],
                },
            )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("solutions", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_solutions, noop_reverse),
    ]
