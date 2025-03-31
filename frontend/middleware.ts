import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that are accessible without authentication
const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// Paths that start with these are public
const publicPathPrefixes = ["/_next", "/favicon.ico"];

// Check if a path starts with any of the public prefixes
const isPublicPrefix = (path: string) => {
  return publicPathPrefixes.some((prefix) => path.startsWith(prefix));
};

// Check if a path is a calendar public booking page
const isPublicCalendarPage = (path: string) => {
  // If it starts with a slash and doesn't have more than one slash,
  // it might be a public calendar path
  const parts = path.split("/").filter(Boolean);
  return (
    parts.length <= 2 &&
    !path.startsWith("/auth/") &&
    !path.startsWith("/dashboard") &&
    !path.startsWith("/calendars")
  );
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Allow requests for public prefixes (CSS, JS, etc.)
  if (isPublicPrefix(pathname)) {
    return NextResponse.next();
  }

  // Allow public calendar pages
  if (isPublicCalendarPage(pathname)) {
    return NextResponse.next();
  }

  // Allow access to public paths (login, register, etc.)
  if (publicPaths.includes(pathname)) {
    // If already authenticated, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Otherwise, allow access to public route
    return NextResponse.next();
  }

  // For authenticated routes, check token
  if (!token) {
    // If path is the root, allow the redirect to happen in the page component
    if (pathname === "/") {
      return NextResponse.next();
    }

    // For any other protected route without a token, redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
