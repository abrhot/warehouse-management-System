// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PAGES = ["/", "/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public pages without auth
  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authToken")?.value;

  // Redirect unauthenticated users trying to access protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ This fixes crypto errors during JWT operations in middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/stock-in/:path*",
    "/stock-out/:path*",
    "/users/:path*",
    "/profile",
    "/reports",
    "/notifications",
  ],
  runtime: "nodejs", // ✅ Required if you use crypto (e.g., JWT)
};
