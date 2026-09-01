import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Sets or clears the `vv_session` cookie that the middleware checks.
 *
 * The cookie holds the Firebase ID token. It's httpOnly (not readable by JS)
 * and short-lived. The auth context posts here on sign-in and deletes here on
 * sign-out, keeping the cookie in sync with Firebase's client auth state.
 */
export async function POST(request: Request) {
  const { idToken } = await request.json().catch(() => ({ idToken: null }));
  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const jar = await cookies();
  jar.set("vv_session", idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour; refreshed whenever the auth state emits
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete("vv_session");
  return NextResponse.json({ ok: true });
}
