# Architecture

## Overview

Syntrix Digital Solutions is a decoupled web application: a Next.js frontend (content, SEO, UI) and a Django REST Framework backend (data, admin, business logic), talking over a versioned JSON API. They deploy, scale, and are developed independently.

```
Browser
  │
  ├── syntrixdigitalsolutions.com  →  Next.js (frontend/)     — SSG/SSR pages, i18n routing, SEO
  │
  └── api.syntrixdigitalsolutions.com → Django + DRF (backend/) — content API, admin, translation dashboard
                                              │
                                              └── PostgreSQL (database/)
```

## Why this split (frontend/backend decoupling)

- **SEO requires server-rendered/static HTML with fast TTFB.** Next.js's App Router gives us static generation for every locale × page combination (162 pages at build time) with true per-page `<title>`, meta tags, JSON-LD, and hreflang — not a client-side-rendered SPA that search engines have to execute JS to index.
- **Content management needs a real admin, not a hand-rolled one.** Django's admin, once you register a model, gives staff a working CRUD UI in minutes — including the translation inlines built for this project (`apps/core/admin.py`). Rebuilding that in a custom Next.js admin panel would be weeks of work for something Django provides for free.
- **Independent scaling.** The marketing site (frontend) gets far more read traffic than the API gets writes. Decoupling means the frontend can be deployed to a CDN/edge platform while the backend scales independently (or not at all, for a low-write CMS workload).
- **Future SaaS path.** The brief asks for a foundation that "can later become a SaaS platform." A REST API backend is the natural seam for that: the same API that serves the marketing site's contact form today can serve a multi-tenant customer dashboard tomorrow, without re-architecting.

## Frontend architecture (`frontend/`)

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · next-intl

**Routing:** every route lives under `src/app/[locale]/...` — `next-intl`'s middleware (`src/middleware.ts`) detects the visitor's browser language, redirects `/` to `/en`, `/sw`, `/fr`, or `/ar`, and rewrites localized pathnames (e.g. `/sw/huduma` ↔ `/en/services`) via a single routing config (`src/i18n/routing.ts`). Adding a 5th language means adding one entry to `src/i18n/locales.ts` plus a `messages/<code>/*.json` directory — no route or component code changes.

**Why next-intl over a hand-rolled i18n solution:** it's the App-Router-native option with typed routing (the `Link`/`useRouter` helpers from `src/i18n/routing.ts` know all valid pathnames at compile time), built-in `hreflang`-friendly locale prefixing, and RTL is "just" the `dir="rtl"` attribute driven by `apps/core/constants.RTL_LANGUAGES` on the frontend side (`src/i18n/locales.ts` → `isRtl()`) — Tailwind's logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) throughout the components mean the layout mirrors automatically instead of needing an `[dir=rtl]` override for every spacing utility.

**Content today vs. content tomorrow:** page copy currently lives in static JSON message catalogs (`src/messages/<locale>/*.json`) rather than being fetched from the Django API at request time. This is a deliberate tradeoff for launch: it keeps the marketing site at maximum performance (fully static, no API round-trip, no cache-invalidation problem) while the backend's `Page`/`PageTranslation` models and REST endpoints already exist and mirror the same shape. Migrating a section from static to CMS-driven later means swapping a `useTranslations()` call for a `fetch()` to `/api/pages/<slug>/`, not redesigning the data model.

**Forms:** contact, newsletter, and job-application forms are client components (`src/components/forms/`) using `react-hook-form` + `zod` for validation, posting directly to the Django API (`NEXT_PUBLIC_API_URL`). CORS is configured on the backend to allow only the frontend's origin.

## Backend architecture (`backend/`)

**Stack:** Django 5.2 (LTS) · Django REST Framework · PostgreSQL · SimpleJWT

**App structure:** one Django app per content domain (`pages`, `services_catalog`, `solutions`, `portfolio`, `blog`, `careers`, `contact`, `newsletter`, `team`), plus two shared apps:

- **`apps/core`** — the multilingual foundation every other app builds on. `BaseTranslation` (abstract model) standardizes `language_code`, `status` (draft/under_review/published), and SEO fields across every translation table. `translatable.py` is a lightweight registry (`register_translatable(...)`, called from each app's `AppConfig.ready()`) that lets generic tooling — the admin dashboard, the `detect_missing_translations` management command — introspect every translatable model without hard-coding a list or creating import cycles.
- **`apps/dashboard`** — the staff-only translation-completeness view (`/dashboard/translations/`) described in the brief: one section per content type, one row per item, one column per language, showing Complete / Under Review / Missing.

**Why "Page → PageTranslation" (and not a JSON field, and not django-parler/django-modeltranslation):** the brief explicitly asks for this shape (`ContentPage` → `PageTranslation`, one row per language, with a status field administrators can move through draft → under review → published). Implementing it directly as plain Django models — rather than pulling in a third-party i18n-for-models package — keeps the schema fully visible in migrations, keeps the admin customization straightforward (the `TranslationInline` factory in `apps/core/admin.py`), and avoids coupling the project to a package whose maintenance status may not match a multi-year platform's needs. The tradeoff is a small amount of repeated boilerplate per app (one extra model, one extra serializer) — acceptable given there are only ~7 translatable content types.

**Authentication:** SimpleJWT for API auth (`/api/auth/token/`), Django's session auth for the admin/dashboard. Public read endpoints (`GET /api/services/`, etc.) don't require auth; write endpoints are either admin-only (via Django Admin, not exposed over the API) or specifically public-and-throttled (contact form, newsletter signup, job applications — see below).

**Public write endpoints are rate-limited**, not authenticated: `POST /api/contact/` (5/hour per IP), `POST /api/newsletter/subscribe/` (5/hour), `POST /api/careers/apply/` (5/hour). This is the standard pattern for public-facing forms — no login should be required to contact a company, but unlimited anonymous POSTs is a spam/DoS vector.

**AI Translation Assistant (`apps/core/services/ai_translation.py`):** defined as an interface (`AITranslationProvider`), not a live integration — there's no LLM API key configured in this environment. The interface exists so the admin/dashboard code and the `generate_translation_draft` workflow can be wired up against it later by implementing one class and setting `AI_TRANSLATION_PROVIDER` in settings, without touching calling code. Deliberately ships as a `NotImplementedError` stub rather than a fake/mocked response, so a missing configuration fails loudly instead of silently producing garbage translations.

## Data flow: a translated page request

1. Visitor requests `syntrixdigitalsolutions.com/` → middleware detects `Accept-Language: fr` → 307 redirect to `/fr`.
2. `/fr` is statically generated at build time (`generateStaticParams` in every `page.tsx` enumerates all 4 locales × all dynamic slugs — 162 total pages).
3. `next-intl` loads `src/messages/fr/*.json` server-side, renders the page, injects `<link rel="alternate" hreflang="...">` for the other 3 locales (`generateMetadata` in `[locale]/layout.tsx`) and JSON-LD (`Organization` schema site-wide, `Service` schema on service detail pages).
4. Interactive bits (language switcher, theme toggle, forms) hydrate as Client Components, sharing the same translated message tree via `NextIntlClientProvider`.

## Security decisions

- **CORS** restricted to the configured frontend origin (`CORS_ALLOWED_ORIGINS`), not `*`.
- **Rate limiting** on every public write endpoint (see above).
- **File uploads** (résumés) go through DRF's `MultiPartParser` with Django's standard upload handling — no custom unsafe file handling.
- **Django admin readonly fields** on `ContactMessage` and `Application`: staff can view submissions but the object list has `has_add_permission() = False` — these are records of external submissions, not admin-authored content, so the admin shouldn't be able to fabricate one.
- **Production settings** (`config/settings/production.py`) enable `SECURE_SSL_REDIRECT`, HSTS, secure cookies, and switch static file serving to WhiteNoise with compressed manifest storage — none of which are safe defaults for local development, hence the settings-module split (`development.py` / `production.py`).
- **Secrets** never hard-coded: `django-environ` reads `DJANGO_SECRET_KEY`, `DATABASE_URL`, etc. from environment variables / `.env` (gitignored); `production.py` has no insecure fallback for `SECRET_KEY` (it raises if unset, rather than silently using a dev key).

## What's static vs. dynamic today

| Concern | Currently | Backed by (for future migration) |
|---|---|---|
| Page copy, nav, footer | Static JSON (`frontend/src/messages/`) | `Page`/`PageTranslation` model + `/api/pages/` |
| Services, Solutions, Portfolio, Blog listings | Static JSON | Matching Django apps + REST endpoints (already built) |
| Contact form, newsletter, job applications | **Live** — posts to Django API | n/a, already dynamic |
| Translation management | **Live** — `/dashboard/translations/` reads real DB state | n/a, already dynamic |

This split is intentional (see "Content today vs. content tomorrow" above) and is the single biggest thing to revisit first on the roadmap — see `ROADMAP.md`.
