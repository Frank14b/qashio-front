'use client';

import { create } from 'zustand';
import { clearSessionCookies, setSessionCookies } from '@/lib/auth/session-cookies';
import type { AuthTokensResponse, AuthUser } from '@/app/(auth)/auth/types';

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  bootstrapped: boolean;
  setSession: (tokens: AuthTokensResponse) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
  setBootstrapped: (bootstrapped: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  bootstrapped: false,

  setSession: (tokens) => {
    setSessionCookies(tokens.refreshToken);
    set({
      accessToken: tokens.accessToken,
      user: tokens.user,
      bootstrapped: true,
    });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  clearSession: () => {
    clearSessionCookies();
    set({ accessToken: null, user: null, bootstrapped: true });
  },

  setBootstrapped: (bootstrapped) => set({ bootstrapped }),
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function applyAuthSession(tokens: AuthTokensResponse): void {
  useAuthStore.getState().setSession(tokens);
}

export function clearAuthSession(): void {
  useAuthStore.getState().clearSession();
}
