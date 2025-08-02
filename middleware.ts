// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PAGES = ["/login", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userRole = decoded.role;

    const adminOnlyRoutes = ["/users", "/notifications"];
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
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
  runtime: "nodejs", // ✅ This fixes the crypto error
};
