import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // Define route types
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage =
    pathname.startsWith("/dashboard") || pathname.startsWith("/courses");

  // 1. Guest Access (No Token)
  if (!token) {
    // Guest tries to access Admin or User pages -> Redirect to Login
    if (isAdminPage || isUserPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Guest accessing Public or Auth pages -> Allow
    return NextResponse.next();
  }

  // 2. Authenticated User Access (Has Token)
  if (token) {
    // Authenticated user tries to access Auth pages -> Redirect to Dashboard or Admin Overview
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      if (role === "admin") {
        url.pathname = "/admin/overview";
      } else {
        url.pathname = "/dashboard";
      }
      return NextResponse.redirect(url);
    }

    // Authenticated user (non-admin) tries to access Admin pages -> Redirect to Dashboard
    if (isAdminPage && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Admin or User accessing their allowed pages -> Allow
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
