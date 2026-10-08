import { AUTH_COOKIE_NAMES } from '@/lib/auth/cookie-names';

const REFRESH_COOKIE = AUTH_COOKIE_NAMES.refresh;
const SESSION_COOKIE = AUTH_COOKIE_NAMES.session;

const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

function readCookie(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function clearCookie(name: string): void {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setSessionCookies(refreshToken: string): void {
  writeCookie(REFRESH_COOKIE, refreshToken, REFRESH_MAX_AGE_SECONDS);
  writeCookie(SESSION_COOKIE, '1', REFRESH_MAX_AGE_SECONDS);
}

export function clearSessionCookies(): void {
  clearCookie(REFRESH_COOKIE);
  clearCookie(SESSION_COOKIE);
}

export function getRefreshTokenFromCookie(): string | null {
  return readCookie(REFRESH_COOKIE);
}

export function hasSessionCookie(): boolean {
  return readCookie(SESSION_COOKIE) === '1' || !!readCookie(REFRESH_COOKIE);
}

export { AUTH_COOKIE_NAMES };
