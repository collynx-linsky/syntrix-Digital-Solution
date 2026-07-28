import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_ACCESS_MAX_AGE,
  ADMIN_REFRESH_COOKIE,
  ADMIN_REFRESH_MAX_AGE,
} from "./lib/admin/constants";

const intlMiddleware = createMiddleware(routing);
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// Decodes the JWT payload only (no signature check — that's a UX
// fast-path here; Django's IsStaffUser re-verifies the signature on every
// real API call, which is the only check that actually matters).
function decodeExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as { exp?: number };
    return parsed.exp ?? null;
  } catch {
    return null;
  }
}

async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) return null;
  return (await res.json()) as { access: string; refresh?: string };
}

async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const exp = accessToken ? decodeExp(accessToken) : null;
  const expiringSoon = !exp || exp * 1000 - Date.now() < 60_000;

  if (!expiringSoon) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    // Access token missing/undecodable and nothing to refresh with — let
    // it through if we at least had a decodable (still-valid) exp; the
    // real IsStaffUser check on the API is what actually protects data.
    return exp ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const refreshed = await refreshTokens(refreshToken);
  if (!refreshed) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(ADMIN_ACCESS_COOKIE);
    response.cookies.delete(ADMIN_REFRESH_COOKIE);
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set(ADMIN_ACCESS_COOKIE, refreshed.access, { ...cookieOpts, maxAge: ADMIN_ACCESS_MAX_AGE });
  if (refreshed.refresh) {
    response.cookies.set(ADMIN_REFRESH_COOKIE, refreshed.refresh, { ...cookieOpts, maxAge: ADMIN_REFRESH_MAX_AGE });
  }
  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    return handleAdminAuth(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
