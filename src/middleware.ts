// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PAGES = ["/", "/login"];
const ADMIN_ONLY_ROUTES = ["/admin/users", "/admin/requests"]; // Updated to match the file paths

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PAGES.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userRole = decoded.role;

    const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));

    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/reports",
    "/settings",
    "/admin/users/:path*", // Updated to match the file path
    "/admin/requests/:path*", // Updated to match the file path
  ],
};