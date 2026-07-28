# Database

**Engine:** PostgreSQL 16 (via Docker Compose in development; a managed Postgres instance — e.g. AWS RDS, DigitalOcean Managed Databases — in production).

The schema itself is not hand-written SQL — it's generated and versioned through Django migrations in `backend/apps/*/migrations/`. This folder documents the design and operational procedures; the migrations are the source of truth for the actual schema.

## Multilingual content pattern

Every translatable content type in the system follows the same shape:

```
<Model>              (language-independent identity: slug, ordering, flags)
  └── <Model>Translation   (one row per language: en / sw / fr / ar)
        - language_code
        - status: draft | under_review | published
        - seo_title, seo_description
        - ...content fields
```

Example — `Page` / `PageTranslation` (`backend/apps/pages/models.py`):

| Page (id=1, slug="homepage") |
|---|
| PageTranslation(language_code="en", title="...", status="published") |
| PageTranslation(language_code="sw", title="...", status="published") |
| PageTranslation(language_code="fr", title="...", status="under_review") |
| *(ar row absent → shown as "Missing" in the admin dashboard)* |

The same pattern is used for `Service`, `Solution`, `Project` (portfolio), `Post` (blog) + `Category`, `JobPosition`, and `TeamMember`. See `backend/apps/core/models.py` (`BaseTranslation`) and `backend/apps/core/translatable.py` (the registry the admin dashboard and `detect_missing_translations` command introspect).

## Non-translatable tables

`ContactMessage`, `Subscriber` (newsletter), and `Application` (job applications) are plain tables — user-submitted data, not editorial content, so there's nothing to translate. They do carry a `language` field recording which locale the submitter was using, for support/reporting purposes.

## Entity overview

| App | Parent model | Translation model | Notes |
|---|---|---|---|
| pages | Page | PageTranslation | CMS-managed page copy (mirrors frontend static content) |
| services_catalog | Service | ServiceTranslation | The 10 service lines |
| solutions | Solution | SolutionTranslation | Industry solutions |
| portfolio | Project | ProjectTranslation | Case studies |
| blog | Category, Post | CategoryTranslation, PostTranslation | |
| careers | JobPosition | JobPositionTranslation | + `Application` (non-translatable) |
| contact | — | — | `ContactMessage` only |
| newsletter | — | — | `Subscriber` only |
| team | TeamMember | TeamMemberTranslation | Leadership bios |

## Common operations

```bash
# Create a migration after changing models
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Back up (from the host, with the db container running)
docker compose exec db pg_dump -U syntrix syntrix > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T db psql -U syntrix syntrix < backup_20260101.sql
```

## Indexing notes for scale

Every `<Model>Translation` table has a unique constraint on `(parent, language_code)`, which Postgres backs with an index — this is the lookup Django uses on every translated read. If the catalog grows large, consider adding a partial index on `status = 'published'` for the public-facing read endpoints.
