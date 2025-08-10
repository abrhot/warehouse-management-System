"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PUBLIC_PAGES = ["/", "/login"];
function middleware(request) {
    var _a;
    const token = (_a = request.cookies.get("authToken")) === null || _a === void 0 ? void 0 : _a.value;
    const { pathname } = request.nextUrl;
    // ✅ Make sure we allow access to public pages (more flexible match)
    const isPublic = PUBLIC_PAGES.some((path) => pathname.startsWith(path));
    if (isPublic) {
        return server_1.NextResponse.next();
    }
    // 🔐 Require token for all protected routes
    if (!token) {
        return server_1.NextResponse.redirect(new URL("/login", request.url));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userRole = decoded.role;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userRole = decoded.role;
            // proceed with userRole
        }
        catch (err) {
            console.error("JWT verification failed:", err);
            // Handle the error (e.g., redirect to login, return 401, etc.)
        }
        // 🔒 Restrict admin-only routes
        const adminOnlyRoutes = ["/users", "/notifications"];
        const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
        if (isAdminRoute && userRole !== "admin") {
            return server_1.NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return server_1.NextResponse.next();
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return server_1.NextResponse.redirect(new URL("/login", request.url));
    }
}
// ✅ This must be at root level: /middleware.ts
exports.config = {
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
