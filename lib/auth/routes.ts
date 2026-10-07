/** Default destination after a successful authenticated session is established. */
export const AUTH_HOME_PATH = '/dashboard';

export const AUTH_GUEST_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

export const PROTECTED_PATH_PREFIXES = [
  '/dashboard',
  '/accounts',
  '/transactions',
  '/change-password',
] as const;

export function resolvePostAuthRedirect(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return AUTH_HOME_PATH;
  }

  const isGuestPath = AUTH_GUEST_PATHS.some(
    (path) => next === path || next.startsWith(`${path}/`),
  );

  if (isGuestPath) {
    return AUTH_HOME_PATH;
  }

  return next;
}
