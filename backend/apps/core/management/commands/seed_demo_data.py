from django.core.management.base import BaseCommand

from apps.core.constants import TranslationStatus
from apps.pages.models import Page, PageTranslation
from apps.services_catalog.models import Service, ServiceTranslation


class Command(BaseCommand):
    help = (
        "Seeds a small amount of demo content (the Homepage CMS page and "
        "the Custom Software Development service) with intentionally "
        "partial translations, so the admin translation dashboard "
        "(/dashboard/translations/) has something meaningful to display "
        "out of the box. Safe to run multiple times (idempotent)."
    )

    def handle(self, *args, **options):
        page, _ = Page.objects.get_or_create(slug="homepage")
        PageTranslation.objects.update_or_create(
            page=page, language_code="en",
            defaults={
                "status": TranslationStatus.PUBLISHED,
                "title": "Engineering the Digital Backbone of East African Business",
                "subtitle": "Custom software, ERP systems, and digital transformation for Tanzania.",
                "seo_title": "Syntrix Digital Solutions | Software Development Company Tanzania",
                "seo_description": "Custom software, ERP systems, SEO, and digital transformation services in Tanzania.",
            },
        )
        PageTranslation.objects.update_or_create(
            page=page, language_code="sw",
            defaults={
                "status": TranslationStatus.PUBLISHED,
                "title": "Tunajenga Msingi wa Kidijitali wa Biashara za Afrika Mashariki",
                "subtitle": "Programu maalum, mifumo ya ERP, na mageuzi ya kidijitali Tanzania.",
            },
        )
        # fr / ar intentionally left unset to demonstrate the "Missing" state.

        service, _ = Service.objects.get_or_create(slug="software-development", defaults={"order": 1})
        ServiceTranslation.objects.update_or_create(
            service=service, language_code="en",
            defaults={
                "status": TranslationStatus.PUBLISHED,
                "title": "Custom Software Development",
                "summary": "Bespoke applications engineered around your exact business processes.",
                "description": "We design and build custom software from the ground up.",
                "features": [
                    "Requirements discovery & solution architecture",
                    "Full-stack development (Django, Next.js, React)",
                ],
            },
        )
        ServiceTranslation.objects.update_or_create(
            service=service, language_code="fr",
            defaults={
                "status": TranslationStatus.UNDER_REVIEW,
                "title": "Développement de Logiciels Sur Mesure",
                "summary": "Des applications sur mesure conçues autour de vos processus métier exacts.",
                "description": "Nous concevons et développons des logiciels sur mesure dès le départ.",
                "features": [],
            },
        )
        # sw / ar intentionally left unset.

        self.stdout.write(self.style.SUCCESS("Demo data seeded. Visit /dashboard/translations/ to view it."))
