// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('authToken')

  // Redirect to login if not authenticated and trying to access protected route
  if (!isLoggedIn && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Define which paths the middleware applies to (optional but recommended)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/stock-in/:path*',
    '/stock-out/:path*',
    '/users/:path*',
    '/profile',
    '/reports',
    '/notifications'
  ]
}
