import { NextResponse } from 'next/server'

export function middleware(req) {
  // Temporarily allow all routes without authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
} 