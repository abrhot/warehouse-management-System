import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login"];
const ADMIN_PATHS = ["/admin/users", "/admin/requests"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  console.log(`[Middleware] ${pathname} - AuthToken exists: ${!!token}`);
  if (token) {
    console.log(`[Middleware] AuthToken value: ${token.substring(0, 20)}...`);
  }

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    console.log(`[Middleware] Public path, allowing access`);
    return NextResponse.next();
  }

  // Allow NextAuth routes without auth
  if (pathname.startsWith("/api/auth")) {
    console.log(`[Middleware] API auth route, allowing access`);
    return NextResponse.next();
  }

  // Allow test and debug routes
  if (pathname.startsWith("/test-") || pathname.startsWith("/simple-")) {
    console.log(`[Middleware] Test route, allowing access`);
    return NextResponse.next();
  }

  if (!token) {
    console.log(`[Middleware] No authToken found, redirecting to login`);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Only process custom token validation if we have a custom token
  if (token) {
    try {
      let userId: string;
      let userRole: string;

      // Try to decode as JWT first
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
        const { payload } = await jwtVerify(token, secret);
        userId = (payload as any).id as string;
        userRole = (payload as any).role as string;
        console.log(`[Middleware] JWT decoded successfully - User: ${userId}, Role: ${userRole}`);
      } catch (jwtError) {
        console.log(`[Middleware] JWT decode failed: ${(jwtError as Error).message}`);
        // If JWT fails, try base64 decoding (for test user)
        try {
          const decoded = JSON.parse(atob(token));
          userId = decoded.id;
          userRole = decoded.role;
          console.log(`[Middleware] Base64 decoded successfully - User: ${userId}, Role: ${userRole}`);
        } catch (base64Error) {
          console.log(`[Middleware] Base64 decode failed: ${(base64Error as Error).message}`);
          throw new Error('Invalid token format');
        }
      }

      if (ADMIN_PATHS.some(path => pathname.startsWith(path)) && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Clone request headers and add user info headers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", userId);
      requestHeaders.set("x-user-role", userRole);

      // IMPORTANT: Create a new NextResponse and pass the modified request with new headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If we reach here, we have a NextAuth token but no custom token, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/reports",
    "/settings",
    "/admin/:path*",
    // Don't protect all API routes, only specific ones
    "/api/dashboard/:path*",
    "/api/products/:path*",
    "/api/reports/:path*",
  ],
};
