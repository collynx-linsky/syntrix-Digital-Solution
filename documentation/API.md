# API Reference

Base URL: `http://localhost:8000` (dev) / `https://api.syntrixdigitalsolutions.com` (prod).

All endpoints return JSON. Public GET endpoints are unauthenticated and read-only; write endpoints are listed explicitly.

## Content (read-only, public)

| Endpoint | Description |
|---|---|
| `GET /api/pages/` / `/api/pages/<slug>/` | CMS pages (e.g. `homepage`) with all language translations nested |
| `GET /api/services/` / `/api/services/<slug>/` | Service catalog |
| `GET /api/solutions/` / `/api/solutions/<slug>/` | Industry solutions |
| `GET /api/portfolio/` / `/api/portfolio/<slug>/` | Case studies. Filter: `?industry=Education`, `?is_featured=true` |
| `GET /api/blog/categories/` | Blog categories |
| `GET /api/blog/posts/` / `/api/blog/posts/<slug>/` | Blog posts. Filter: `?category__slug=seo` |
| `GET /api/careers/` / `/api/careers/<slug>/` | Open job positions |
| `GET /api/team/` / `/api/team/<slug>/` | Team members |

Every translatable resource nests a `translations` array:

```json
{
  "id": 1,
  "slug": "software-development",
  "translations": [
    { "language_code": "en", "status": "published", "title": "Custom Software Development", ... },
    { "language_code": "sw", "status": "published", "title": "Utengenezaji wa Programu Maalum", ... }
  ]
}
```

## Public write endpoints (rate-limited, no auth required)

| Endpoint | Method | Rate limit | Body |
|---|---|---|---|
| `/api/contact/` | POST | 5/hour/IP | `name, email, phone?, company?, service?, budget?, message, language?` |
| `/api/newsletter/subscribe/` | POST | 5/hour/IP | `email, language?` (idempotent — re-subscribing reactivates) |
| `/api/careers/apply/` | POST (multipart) | 5/hour/IP | `full_name, email, phone?, linkedin?, cover_message, resume (file), consent (true), position_slug, language?` |

## Auth

| Endpoint | Method | Notes |
|---|---|---|
| `/api/auth/token/` | POST | `{ username, password }` → `{ access, refresh }` (SimpleJWT) |
| `/api/auth/token/refresh/` | POST | `{ refresh }` → `{ access }` |

JWT auth is provisioned for future authenticated features (customer/staff API access beyond the Django Admin). The public site itself doesn't currently require login for anything.

## Admin / staff (session auth, not part of the public API)

| URL | Purpose |
|---|---|
| `/admin/` | Django Admin — manage every content type, contact messages, applications, newsletter subscribers |
| `/dashboard/translations/` | Translation-completeness matrix (staff-only) |

## Errors

Validation errors return `400` with a DRF-standard field-error body:

```json
{ "email": ["Enter a valid email address."] }
```

Rate-limit breaches return `429` with a `Retry-After` header.
