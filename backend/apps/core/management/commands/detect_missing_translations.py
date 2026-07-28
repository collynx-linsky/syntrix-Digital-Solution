from django.core.management.base import BaseCommand

from apps.core.constants import LANGUAGE_CODES
from apps.core.translatable import get_translatable_registry


class Command(BaseCommand):
    help = (
        "Scans every registered translatable model and reports which "
        "parent objects are missing a translation row for one or more "
        "supported languages. Powers the same data the admin translation "
        "dashboard displays; run this in CI or a scheduled job to catch "
        "missing translations before they reach production."
    )

    def handle(self, *args, **options):
        registry = get_translatable_registry()
        if not registry:
            self.stdout.write(self.style.WARNING("No translatable models are registered."))
            return

        total_gaps = 0
        for entry in registry:
            self.stdout.write(self.style.MIGRATE_HEADING(f"\n{entry.label}"))
            for parent in entry.parent_model.objects.all():
                existing = set(
                    entry.translation_model.objects.filter(
                        **{entry.fk_name: parent}
                    ).values_list("language_code", flat=True)
                )
                missing = [code for code in LANGUAGE_CODES if code not in existing]
                if missing:
                    total_gaps += len(missing)
                    label = getattr(parent, "slug", None) or str(parent)
                    self.stdout.write(
                        f"  - {label}: missing {', '.join(missing)}"
                    )

        if total_gaps == 0:
            self.stdout.write(self.style.SUCCESS("\nAll translations complete."))
        else:
            self.stdout.write(self.style.WARNING(f"\n{total_gaps} missing translation(s) found."))
