# Syntrix Digital Solutions

Enterprise-grade corporate website and content platform for **Syntrix Digital Solutions**, a technology and digital transformation company based in Dar es Salaam, Tanzania, serving East Africa.

A decoupled **Next.js (frontend) + Django REST Framework (backend)** application with full internationalization (English, Kiswahili, French, Arabic — including RTL), a multilingual CMS data model, and an admin translation-management dashboard.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind CSS · next-intl |
| Backend | Django 5.2 LTS · Django REST Framework · SimpleJWT |
| Database | PostgreSQL 16 |
| Infra | Docker · Docker Compose · Nginx (reference config) |

See `documentation/ARCHITECTURE.md` for the full breakdown and the reasoning behind these choices.

## Folder structure

```
SyntrixDigitalSolutions/
├── frontend/                  Next.js app
│   ├── src/
│   │   ├── app/[locale]/      All routes, localized (en/sw/fr/ar)
│   │   ├── components/        layout/, home/, forms/, ui/
│   │   ├── i18n/               locales.ts, routing.ts, request.ts
│   │   ├── messages/           <locale>/*.json — translated content, 11 namespaces × 4 languages
│   │   └── lib/                seo.ts, api.ts, utils.ts
│   ├── public/brand/           logo.svg (placeholder — see assets/README.md)
│   └── Dockerfile
│
├── backend/                   Django project
│   ├── config/settings/        base.py, development.py, production.py
│   └── apps/
│       ├── core/                shared translation base models, registry, AI translation interface
│       ├── pages/                Page/PageTranslation (CMS pages)
│       ├── services_catalog/     Service/ServiceTranslation
│       ├── solutions/            Solution/SolutionTranslation
│       ├── portfolio/            Project/ProjectTranslation
│       ├── blog/                 Category, Post (+ translations)
│       ├── careers/              JobPosition (+ translations), Application
│       ├── contact/              ContactMessage
│       ├── newsletter/           Subscriber
│       ├── team/                 TeamMember/TeamMemberTranslation
│       └── dashboard/            /dashboard/translations/ — translation completeness UI
│   └── Dockerfile
│
├── database/                  Schema documentation, backup/restore commands
├── documentation/             ARCHITECTURE.md, API.md, DEPLOYMENT.md, ROADMAP.md
├── deployment/                docker-compose.prod.yml, nginx.conf
├── assets/                    Brand assets and notes
├── docker-compose.yml         Local dev orchestration (Postgres + backend + frontend)
└── README.md                  This file
```

## Quick start

**Prerequisites:** Node.js 20+, Python 3.11–3.12 or 3.14 (see note in `documentation/DEPLOYMENT.md`), PostgreSQL 16 (or Docker).

### Option A — Docker (recommended, matches production)

```bash
cp .env.example .env
docker compose up --build
```

Frontend → http://localhost:3000 · API → http://localhost:8000/api/ · Admin → http://localhost:8000/admin/

### Option B — Run natively

```bash
# Backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements/development.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data      # optional demo content for the translation dashboard
python manage.py runserver

# Frontend (separate terminal)
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Full instructions, including Python-version notes and platform alternatives (Vercel, Render, etc.), are in `documentation/DEPLOYMENT.md`.

## Development commands

| Command | Where | Does |
|---|---|---|
| `npm run dev` | `frontend/` | Dev server, hot reload |
| `npm run build` | `frontend/` | Production build (also runs typecheck + lint) |
| `npm run lint` / `npm run typecheck` | `frontend/` | Lint / type-check only |
| `python manage.py runserver` | `backend/` | Dev server |
| `python manage.py makemigrations` / `migrate` | `backend/` | Schema changes |
| `python manage.py detect_missing_translations` | `backend/` | CLI report of missing translations (same data as `/dashboard/translations/`) |
| `python manage.py createsuperuser` | `backend/` | Create an admin login |

## Multilingual system

- **Languages:** English (default), Kiswahili, French, Arabic (RTL) — see `frontend/src/i18n/locales.ts`.
- **URLs:** `/en/`, `/sw/`, `/fr/`, `/ar/`, with localized pathnames per locale (e.g. `/en/services` ↔ `/sw/huduma`) — see `frontend/src/i18n/routing.ts`.
- **Content model:** every translatable entity is `<Model>` + `<Model>Translation` (one row per language, with a `draft → under_review → published` status) — see `database/README.md`.
- **Admin dashboard:** `/dashboard/translations/` shows completeness (✓ Complete / ⚠ Missing / Under Review) per content type, per language.
- **SEO:** hreflang tags, per-locale sitemaps entries, localized metadata/keywords per page — see `documentation/ARCHITECTURE.md`.
- **AI translation assistant:** interface defined and ready to wire up (`backend/apps/core/services/ai_translation.py`) — not connected to a live provider in this environment (no API key configured).

## Deployment

See `documentation/DEPLOYMENT.md` for the full guide (production Docker Compose, Nginx config, platform alternatives, post-deploy checklist).

## Roadmap

This is a launch-ready **foundation**, not a finished product. See `documentation/ROADMAP.md` for the prioritized list of what's next — starting with replacing placeholder content (contact details, legal pages, logo, portfolio case studies) and closing the gap between the static frontend content and the already-built CMS backend.

## Known placeholders (replace before launch)

- Contact email/phone (`frontend/src/messages/*/contact.json`, `footer.json`) — currently `info@syntrixdigitalsolutions.com` / `+255 700 000 000`
- Logo (`frontend/public/brand/logo.svg`) — a simple monogram placeholder, not a final designed identity
- Privacy Policy / Terms of Service pages — explicit placeholder text pending legal review
- Portfolio case studies, team bios — illustrative sample data demonstrating the schema, not real client work
