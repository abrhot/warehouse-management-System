// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const isLoggedIn = !!token;

  if (!isLoggedIn && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

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
};
