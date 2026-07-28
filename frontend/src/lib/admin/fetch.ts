import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE, ADMIN_ACCESS_MAX_AGE, ADMIN_REFRESH_COOKIE, ADMIN_REFRESH_MAX_AGE } from "./constants";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Thrown when the access token is invalid/expired and either refresh
// wasn't attempted (reads from Server Components — cookies() can't be
// mutated there in Next 15) or refresh itself failed. Callers redirect to
// /admin/login.
export class AdminSessionExpiredError extends Error {}

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

async function refreshAccessToken(): Promise<string | null> {
  const store = await cookies();
  const refreshToken = store.get(ADMIN_REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access: string; refresh?: string };
  store.set(ADMIN_ACCESS_COOKIE, data.access, { ...cookieOpts, maxAge: ADMIN_ACCESS_MAX_AGE });
  if (data.refresh) {
    store.set(ADMIN_REFRESH_COOKIE, data.refresh, { ...cookieOpts, maxAge: ADMIN_REFRESH_MAX_AGE });
  }
  return data.access;
}

type AdminFetchOptions = RequestInit & {
  // Only Route Handlers / Server Actions may set this — they're the only
  // places Next 15 allows cookies() mutation, which a refresh requires.
  allowRefresh?: boolean;
};

/**
 * Server-only fetch to the Django admin API, attaching the access token
 * cookie as a Bearer header. Reads (Server Components) call this without
 * allowRefresh and let AdminSessionExpiredError bubble to a redirect;
 * writes (Route Handlers/Server Actions) pass allowRefresh: true so an
 * expired token gets one refresh-and-retry before failing.
 */
export async function adminFetch<T>(path: string, opts: AdminFetchOptions = {}): Promise<T> {
  const { allowRefresh = false, headers, ...rest } = opts;
  const store = await cookies();
  const accessToken = store.get(ADMIN_ACCESS_COOKIE)?.value;

  const doFetch = (token?: string) =>
    fetch(`${API_URL}${path}`, {
      ...rest,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
      cache: "no-store",
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && allowRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  if (res.status === 401) {
    throw new AdminSessionExpiredError("Admin session expired");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new AdminApiError(res.status, data.detail ?? "Request failed");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function adminFetchJson<T>(
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: unknown,
  opts: AdminFetchOptions = {},
): Promise<T> {
  return adminFetch<T>(path, {
    ...opts,
    method,
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
