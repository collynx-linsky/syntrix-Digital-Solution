import json
from pathlib import Path

from django.db import migrations

# lucide-react icon name (kebab-case) per slug — matches what the public
# services pages originally hardcoded before becoming DB-driven.
ICONS = {
    "software-development": "code-2",
    "web-development": "globe-2",
    "erp-solutions": "building-2",
    "mobile-applications": "smartphone",
    "seo-services": "search-check",
    "digital-marketing": "megaphone",
    "branding": "palette",
    "cloud-solutions": "cloud",
    "it-consulting": "users",
    "automation": "workflow",
}

LOCALES = ["en", "sw", "fr", "ar"]


def _load_items_by_locale():
    """Reads the pre-existing, already-translated static content from the
    frontend's messages/*/services.json (source of truth before this app
    became DB-driven) so it can seed real starting rows instead of leaving
    the admin panel empty. Best-effort: if the frontend tree isn't present
    (e.g. a backend-only deploy checkout), seeding is silently skipped —
    this is additive, one-time convenience, not a hard dependency."""
    root = Path(__file__).resolve().parents[4]
    messages_dir = root / "frontend" / "src" / "messages"
    result = {}
    for locale in LOCALES:
        path = messages_dir / locale / "services.json"
        try:
            with open(path, encoding="utf-8") as f:
                result[locale] = json.load(f)["items"]
        except (OSError, KeyError, json.JSONDecodeError):
            return None
    return result


def seed_services(apps, schema_editor):
    items_by_locale = _load_items_by_locale()
    if items_by_locale is None:
        return

    Service = apps.get_model("services_catalog", "Service")
    ServiceTranslation = apps.get_model("services_catalog", "ServiceTranslation")

    en_items = items_by_locale["en"]
    for order, en_item in enumerate(en_items):
        slug = en_item["slug"]
        service, _ = Service.objects.get_or_create(
            slug=slug,
            defaults={"icon": ICONS.get(slug, ""), "order": order, "is_active": True},
        )

        for locale in LOCALES:
            item = next((i for i in items_by_locale[locale] if i["slug"] == slug), None)
            if item is None:
                continue
            ServiceTranslation.objects.get_or_create(
                service=service,
                language_code=locale,
                defaults={
                    "status": "published",
                    "title": item["title"],
                    "summary": item["summary"],
                    "description": item["description"],
                    "features": item["features"],
                },
            )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("services_catalog", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_services, noop_reverse),
    ]
