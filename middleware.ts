import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Server-side gate for the admin area.
 *
 * Firebase Auth lives in the browser, so on login we also drop a `vv_session`
 * cookie (see /api/session). This middleware runs before any /admin page loads:
 * if that cookie is absent, the request is redirected to /admin/login — so
 * typing /admin in the URL bar can no longer reach the dashboard while logged
 * out. Actual data access is additionally enforced by Firestore security rules.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const hasSession = Boolean(req.cookies.get("vv_session")?.value);

  if (!isLogin && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
