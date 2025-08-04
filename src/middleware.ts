import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PAGES = ["/", "/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // ✅ Make sure we allow access to public pages (more flexible match)
  const isPublic = PUBLIC_PAGES.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  // 🔐 Require token for all protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userRole = decoded.role;

    // 🔒 Restrict admin-only routes
    const adminOnlyRoutes = ["/users", "/notifications"];
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// ✅ This must be at root level: /middleware.ts
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
