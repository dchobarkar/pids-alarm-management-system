import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-paths";

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const pathname = nextUrl.pathname;

  const isAuthRoute =
    pathname === "/auth/signin" ||
    pathname === "/auth/register" ||
    pathname === "/auth/error";

  const isHome = pathname === "/";
  const isApiRoute = pathname.startsWith("/api");

  // Never interfere with API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // If logged in, prevent visiting auth pages
  if (session && isAuthRoute) {
    const role = session.user?.role;
    const target = getDashboardPathForRole(role);
    return NextResponse.redirect(new URL(target, nextUrl));
  }

  // If not logged in, block non-auth, non-home pages
  const isPublicRoute = isAuthRoute || isHome;
  if (!session && !isPublicRoute) {
    const signinUrl = new URL("/auth/signin", nextUrl);
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

