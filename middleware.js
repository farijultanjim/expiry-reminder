import { NextResponse } from 'next/server';

// This middleware will run on every request to the app
export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === "/"
  const token = request.cookies.get("token")?.value || ""

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/home/:path*', 
    '/profile'
  ], 
};
