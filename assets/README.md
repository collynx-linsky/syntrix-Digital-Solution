# Brand Assets

## Logo

`brand/logo.svg` is a **placeholder** wordmark (a rounded square with an "S" monogram in the primary brand gradient) — it exists so the codebase has a working logo reference (favicon, structured data, footer) without blocking development. It is not a final identity and should be replaced with a professionally designed logo before public launch. The same file is duplicated at `frontend/public/brand/logo.svg`, which is the copy actually served by the website; update both or replace the frontend copy and point this folder's copy at it via a symlink/build step if you want a single source of truth.

## Social preview images

The Open Graph / Twitter card image (1200×630) and the favicon are **generated dynamically** at request time from React/CSS using Next.js's `ImageResponse` API, rather than shipped as static files:

- `frontend/src/app/[locale]/opengraph-image.tsx` — per-locale OG image (brand gradient, wordmark, tagline, localized via next-intl)
- `frontend/src/app/icon.tsx` — favicon

This means social previews automatically stay in sync with brand colors and translated taglines with no design-export step. If you commission a designed OG template later, drop a static image at `frontend/src/app/[locale]/opengraph-image.png` (or `.jpg`) and delete `opengraph-image.tsx` — Next.js's file convention picks up either automatically.

## Brand guidelines (summary)

Full color tokens live in `frontend/tailwind.config.ts` under `theme.extend.colors`. Summary:

| Token | Value | Use |
|---|---|---|
| `brand-950` → `brand-500` | `#071646` → `#1f5fff` | Deep technology blue — primary brand color, dark-to-light scale |
| `ink-950` → `ink-50` | `#05070b` → `#f5f6f8` | Professional black / graphite — text, backgrounds, borders |
| `accent-teal` | `#0fd6c9` | Success states, highlights |
| `accent-amber` | `#ffb020` | Warnings, "under review" status |

**Typography:** Sora (display/headings) + Inter (body), both loaded via `next/font/google` in `frontend/src/app/[locale]/layout.tsx`.

A standalone brand guideline document (usage rules, logo clear-space, do/don't examples) is a natural next deliverable once a designer produces the final logo — track it here as `assets/brand/BRAND_GUIDELINES.md` when ready.
