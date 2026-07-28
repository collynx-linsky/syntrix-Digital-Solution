import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/admin/fetch";
import { ADMIN_ACCESS_COOKIE, ADMIN_ACCESS_MAX_AGE, ADMIN_REFRESH_COOKIE, ADMIN_REFRESH_MAX_AGE } from "@/lib/admin/constants";

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const tokenRes = await fetch(`${API_URL}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ detail: "Invalid username or password." }, { status: 401 });
  }

  const { access, refresh } = (await tokenRes.json()) as { access: string; refresh: string };

  const meRes = await fetch(`${API_URL}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  const me = meRes.ok ? ((await meRes.json()) as { username: string; email: string; is_staff: boolean }) : null;

  if (!me?.is_staff) {
    return NextResponse.json({ detail: "This account does not have admin access." }, { status: 403 });
  }

  const store = await cookies();
  store.set(ADMIN_ACCESS_COOKIE, access, { ...cookieOpts, maxAge: ADMIN_ACCESS_MAX_AGE });
  store.set(ADMIN_REFRESH_COOKIE, refresh, { ...cookieOpts, maxAge: ADMIN_REFRESH_MAX_AGE });

  return NextResponse.json({ username: me.username, email: me.email });
}
