# Roadmap

What exists today is a production-ready **foundation**, not a finished platform. This is the honest list of what's next, roughly in priority order.

## Phase 1 — Launch readiness (before going live)

- [ ] Replace all placeholder content: real contact email/phone, real leadership bios/photos, real portfolio case studies (current ones are clearly-labeled sample data demonstrating the schema)
- [ ] Legal review of `privacy/` and `terms/` pages (currently explicit placeholders)
- [ ] Commission a real logo and brand guideline document (currently a placeholder "S" mark — see `assets/README.md`)
- [ ] Professional human review of the Kiswahili, French, and Arabic translations (machine-assisted first drafts, done by the AI that built this project — solid but not a substitute for native-speaker review, especially for Arabic RTL typography edge cases)
- [ ] Wire up transactional email: contact form submissions and job applications currently only land in the Django Admin — no one gets notified. Add `django-anymail` or plain SMTP notifications.
- [ ] Load-test the contact/newsletter/application endpoints' rate limits under realistic traffic before launch

## Phase 2 — Make the CMS real

The biggest architectural "not yet" in this codebase: page/service/solution/portfolio/blog copy lives in static JSON (`frontend/src/messages/`), while the matching Django models and API endpoints already exist and mirror the same shape (see `documentation/ARCHITECTURE.md` → "What's static vs. dynamic today"). Closing that gap means:

- [ ] Build a data migration/seed script that imports the existing JSON content into the Django models (the JSON is already structured 1:1 with the models — this is mechanical, not a redesign)
- [ ] Switch frontend pages from `next-intl` static messages to `fetch()`-ing the Django API, with `revalidate`/ISR or on-demand revalidation so content edits in the admin go live without a redeploy
- [ ] Extend the Django Admin (or build a small custom admin UI) for non-technical staff to edit page content, not just translations

## Phase 3 — Admin & translation workflow

- [ ] Wire `apps/core/services/ai_translation.py` to a real LLM provider (interface is ready; needs an API key and one class implementing `AITranslationProvider`) to generate first-draft translations and flag missing ones automatically
- [ ] Add a "duplicate translation to another language" admin action (mentioned in the brief; the data model supports it, the UI action doesn't exist yet)
- [ ] Add image/media management in the admin beyond raw `ImageField` uploads — a proper media library with alt-text enforcement (SEO) and automatic responsive variants
- [ ] Role-based permissions: separate "content editor" and "translator" staff roles instead of one blanket `is_staff`

## Phase 4 — Toward SaaS

The brief asks this project be a foundation that "can later become a SaaS platform." What that implies, not yet built:

- [ ] Multi-tenancy (organization/account model, if the product direction becomes "give other companies their own instance" rather than "grow Syntrix's own site")
- [ ] Billing integration (Stripe or similar)
- [ ] Usage analytics / customer-facing dashboards
- [ ] Public API rate-limit tiers tied to API keys instead of just IP-based anonymous throttling

## Ongoing / never "done"

- [ ] SEO: monitor Search Console per locale, expand blog content targeting the keyword list in `documentation/ARCHITECTURE.md` and `frontend/src/messages/*/seo.json`
- [ ] Accessibility audit (automated + manual screen-reader pass, especially for the Arabic RTL layout)
- [ ] Performance budget monitoring (Core Web Vitals) as real content/images are added
- [ ] Dependency updates — this was built against Next.js 15, React 19, Django 5.2 LTS; keep pace with security patches
