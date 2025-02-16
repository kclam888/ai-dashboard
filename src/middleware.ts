import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAuthenticated = !!req.nextauth.token

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/home', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        // Allow auth pages to be accessed without a token
        if (isAuthPage) {
          return true
        }
        return !!token
      }
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: [
    // Protect all routes except auth, static files, and API routes
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
} 