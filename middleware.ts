import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  
  // Public routes
  const publicRoutes = ['/login', '/contact', '/privacy', '/terms', '/help', '/'];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    if (request.nextUrl.pathname === '/login' && token) {
      const session = await verifySession(token);
      if (session) {
        // Redirect to appropriate dashboard
        if (session.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }
  
  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const session = await verifySession(token);
  
  if (!session) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
  
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (session.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // User routes protection (prevent admin from accessing user dashboard)
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/withdraw')) {
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


