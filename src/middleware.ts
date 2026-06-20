import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/daftar", "/api/auth"];
const anggotaRoutes = ["/anggota/portal"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Allow anggota portal routes
  if (anggotaRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/manifest") ||
    pathname.includes(".png") ||
    pathname.includes(".ico")
  ) {
    return NextResponse.next();
  }

  // For dashboard routes, the client-side auth check in layout.tsx handles redirect
  // This middleware mainly ensures API routes are protected
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    // API routes - authentication is handled per-route
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};