import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAMES } from './lib/auth/cookie-names';
import {
  AUTH_GUEST_PATHS,
  AUTH_HOME_PATH,
  PROTECTED_PATH_PREFIXES,
} from './lib/auth/routes';

function matches(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasSession(request: NextRequest): boolean {
  const session = request.cookies.get(AUTH_COOKIE_NAMES.session)?.value;
  const refresh = request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value;
  return session === '1' || Boolean(refresh);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasSession(request);

  if (matches(pathname, PROTECTED_PATH_PREFIXES) && !authenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matches(pathname, AUTH_GUEST_PATHS) && authenticated) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = AUTH_HOME_PATH;
    appUrl.search = '';
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/accounts/:path*',
    '/transactions/:path*',
    '/budgets/:path*',
    '/categories/:path*',
    '/change-password/:path*',
    '/auth/:path*',
  ],
};
