import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from './services/server/auth';

const AUTH_ROUTES = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

const REQUIRES_AUTH = ['/finish-up'];

const STAFF_PREFIXES = ['/dashboard'];

const ADMIN_ONLY_PREFIXES = [
  '/dashboard/users',
  '/dashboard/help-requests',
  '/dashboard/app-data',
];

export async function middleware(request: NextRequest) {
  const { data: user } = await getUser();
  const path = request.nextUrl.pathname;

  if (user && AUTH_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!user && REQUIRES_AUTH.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
  }

  if (STAFF_PREFIXES.some(p => path.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
    }
    if (!user.is_staff) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  if (ADMIN_ONLY_PREFIXES.some(p => path.startsWith(p))) {
    if (!user?.is_superuser) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/finish-up/:path*',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
  ],
};
