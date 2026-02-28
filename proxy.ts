import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/nextauth";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-paths";
import {
  AUTH_PUBLIC_ROUTES,
  AUTH_SIGN_IN_PATH,
  HOME_PATH,
} from "@/constants/auth";

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const pathname = nextUrl.pathname;

  const isAuthRoute = AUTH_PUBLIC_ROUTES.some((route) => pathname === route);
  const isHome = pathname === HOME_PATH;
  const isApiRoute = pathname.startsWith("/api");
  const isPublicRoute = isAuthRoute || isHome;

  // Never interfere with API routes
  if (isApiRoute) return NextResponse.next();

  // If logged in: redirect home and auth pages to role dashboard (auth centralized here)
  if (session?.user?.role) {
    if (isHome || isAuthRoute) {
      const target = getDashboardPathForRole(session.user.role);
      return NextResponse.redirect(new URL(target, nextUrl));
    }
  }

  // If not logged in, block non-auth, non-home pages
  if (!session && !isPublicRoute) {
    const signinUrl = new URL(AUTH_SIGN_IN_PATH, nextUrl);
    signinUrl.searchParams.set(
      "callbackUrl",
      nextUrl.pathname + nextUrl.search,
    );
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
