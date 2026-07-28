# Deployment Guide

## Server requirements

- Any Linux VM/host capable of running Docker (2 vCPU / 4GB RAM is comfortable for launch traffic; scale up based on real usage)
- Docker Engine 24+ and the Docker Compose plugin
- A domain with DNS pointed at the host (`syntrixdigitalsolutions.com`, and optionally `api.syntrixdigitalsolutions.com` if you split subdomains)
- Ports 80/443 open (Nginx terminates TLS); 5432/8000/3000 stay internal to the Docker network in production

## Local development

```bash
# 1. Clone and enter the project
cd E:\SyntrixDigitalSolutions

# 2. Backend
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS/Linux
pip install -r requirements/development.txt
copy .env.example .env            # then edit values
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data   # optional: populates the translation dashboard with sample content
python manage.py runserver

# 3. Frontend (new terminal)
cd frontend
npm install
copy .env.example .env.local      # then edit values
npm run dev
```

Frontend: http://localhost:3000 · Backend API: http://localhost:8000/api/ · Admin: http://localhost:8000/admin/ · Translation dashboard: http://localhost:8000/dashboard/translations/

**Note on Python versions:** this was validated against Python 3.14. Django 5.1 has a known incompatibility with Python 3.14's `copy` module internals (breaks the admin's template context); **Django 5.2 (LTS) fixes this**, which is why `requirements/base.txt` pins `Django>=5.2,<5.3`. If you use Python 3.11–3.12, either version works fine. The Docker image uses Python 3.12 regardless, so this only matters for running the backend directly on the host.

## Local development with Docker

```bash
cp .env.example .env    # project root — Postgres credentials, public URLs
docker compose up --build
```

This starts Postgres, runs migrations automatically, and serves the backend (`:8000`) and frontend (`:3000`) with source bind-mounted for live reload.

## Production deployment

```bash
# On the server, after cloning the repo:
cp .env.example .env
cp backend/.env.example backend/.env
# edit both — real secrets, real DJANGO_SECRET_KEY, real DJANGO_ALLOWED_HOSTS,
# real NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_API_URL, DJANGO_SETTINGS_MODULE=config.settings.production

docker compose -f docker-compose.yml -f deployment/docker-compose.prod.yml up -d --build

docker compose exec backend python manage.py createsuperuser
```

Then point Nginx (or your platform's equivalent — an ALB, Caddy, etc.) at the two containers using `deployment/nginx.conf` as a reference: `/api/`, `/admin/`, `/dashboard/`, `/static/`, `/media/` → backend; everything else → frontend. Get a TLS certificate (Let's Encrypt via certbot, or your platform's managed TLS) and enable the `ssl_certificate` lines in that config.

### Platform alternatives

The two services are independently deployable, so you're not locked into a single-host Docker Compose setup:

- **Frontend** deploys cleanly to Vercel (it's a standard Next.js app) or any Node host — set `NEXT_PUBLIC_API_URL` to wherever the backend ends up.
- **Backend** deploys to any container platform (Render, Railway, ECS/Fargate, a plain VM) — it just needs a Postgres connection string and the environment variables in `backend/.env.example`.

## Post-deploy checklist

- [ ] `DJANGO_DEBUG=False`, real `DJANGO_SECRET_KEY`, correct `DJANGO_ALLOWED_HOSTS`
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real domain (used for canonical URLs, sitemap, hreflang)
- [ ] Database backups scheduled (see `database/README.md` for `pg_dump`/`pg_restore` commands)
- [ ] Real contact email / phone number in place of the placeholders in `frontend/src/messages/*/contact.json` and `footer.json`
- [ ] `frontend/src/app/[locale]/privacy/page.tsx` and `terms/page.tsx` replaced with counsel-reviewed copy (currently explicit placeholders)
- [ ] `frontend/public/brand/logo.svg` replaced with a final designed logo (currently an explicit placeholder — see `assets/README.md`)
- [ ] SMTP credentials set (`EMAIL_HOST`/`EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD`) if you want contact-form/application email notifications (not wired up yet — see roadmap)
- [ ] `python manage.py collectstatic` has run (the Docker entrypoint does this automatically)
- [ ] Google Search Console verified for all 4 locale variants; submit `https://syntrixdigitalsolutions.com/sitemap.xml`
