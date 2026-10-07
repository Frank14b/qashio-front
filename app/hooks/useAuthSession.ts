'use client';

import { useEffect } from 'react';
import { authService } from '@/app/(auth)/auth/services/auth.service';
import { configureAuthInterceptors } from '@/lib/api/http-client';
import { getRefreshTokenFromCookie, setSessionCookies } from '@/lib/auth/session-cookies';
import { getAccessToken, useAuthStore } from '@/stores/authStore';

let interceptorsConfigured = false;

function ensureInterceptors(): void {
  if (interceptorsConfigured) {
    return;
  }

  configureAuthInterceptors({
    getAccessToken,
    onTokensRefreshed: ({ accessToken, refreshToken }) => {
      setSessionCookies(refreshToken);
      useAuthStore.getState().setAccessToken(accessToken);
    },
    onAuthFailure: () => {
      useAuthStore.getState().clearSession();
    },
  });
  interceptorsConfigured = true;
}

export function useAuthSession() {
  ensureInterceptors();

  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      ensureInterceptors();
      const refreshToken = getRefreshTokenFromCookie();

      if (!refreshToken) {
        if (!cancelled) {
          setBootstrapped(true);
        }
        return;
      }

      if (useAuthStore.getState().accessToken) {
        if (!cancelled) {
          setBootstrapped(true);
        }
        return;
      }

      try {
        const session = await authService.refresh({ refreshToken });
        if (!cancelled) {
          setSession(session);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setBootstrapped(true);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [clearSession, setBootstrapped, setSession]);

  return {
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    bootstrapped,
    setSession,
    clearSession,
  };
}
