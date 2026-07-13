import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/lib/constants";

/** Better Auth default session cookie names (dev + secure prefix). */
const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

const AUTH_PATHS = new Set<string>([ROUTES.LOGIN, ROUTES.REGISTER]);

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => {
    const value = request.cookies.get(name)?.value;
    return Boolean(value);
  });
}

/**
 * Next.js 16 request boundary (formerly `middleware`).
 * Optimistic session-cookie gate — real auth still enforced by the API.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = hasSessionCookie(request);
  const isAuthRoute = AUTH_PATHS.has(pathname);

  if (!isAuthed && !isAuthRoute) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthed && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip static assets, Next internals, and image optimizer.
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
