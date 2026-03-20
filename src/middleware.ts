import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PATHS = ["/admin/users", "/admin/requests", "/admin/approvals"];

async function decodeToken(token: string): Promise<{ id: string; role: string } | null> {
  // Try JWT first
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    const { payload } = await jwtVerify(token, secret);
    return { id: (payload as any).id, role: (payload as any).role };
  } catch {}
  // Fallback: base64 (legacy demo tokens)
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.id && decoded.role) return { id: decoded.id, role: decoded.role };
  } catch {}
  return null;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  // Always allow API auth routes and static assets
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Root "/" — redirect to dashboard if logged in, otherwise to login
  if (pathname === "/") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    const user = await decodeToken(token);
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Login page — redirect to dashboard if already logged in
  if (pathname.startsWith("/login")) {
    if (token) {
      const user = await decodeToken(token);
      if (user) return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await decodeToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only paths — redirect non-admins to dashboard
  if (ADMIN_PATHS.some(path => pathname.startsWith(path)) && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Inject user info into request headers for API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-role", user.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Match everything except static files and _next internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
