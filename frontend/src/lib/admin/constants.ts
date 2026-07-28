// Shared between middleware.ts (Edge runtime) and lib/admin/fetch.ts (Node
// runtime) — kept dependency-free so both can import it safely.
export const ADMIN_ACCESS_COOKIE = "sx_admin_at";
export const ADMIN_REFRESH_COOKIE = "sx_admin_rt";

// Mirror backend/config/settings/base.py SIMPLE_JWT lifetimes.
export const ADMIN_ACCESS_MAX_AGE = 60 * 60; // 1 hour
export const ADMIN_REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
