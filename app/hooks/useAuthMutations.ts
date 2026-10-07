'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/app/(auth)/auth/services/auth.service';
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/app/(auth)/auth/types';
import { AUTH_HOME_PATH, resolvePostAuthRedirect } from '@/lib/auth/routes';
import { getRefreshTokenFromCookie } from '@/lib/auth/session-cookies';
import { applyAuthSession, clearAuthSession } from '@/stores/authStore';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (result) => {
      // Register does not open a session yet — verify email OTP first, then dashboard.
      router.push(`/auth/verify-email?email=${encodeURIComponent(result.email)}`);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authService.verifyEmail(payload),
    onSuccess: (tokens) => {
      applyAuthSession(tokens);
      router.replace(AUTH_HOME_PATH);
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (tokens) => {
      applyAuthSession(tokens);
      router.replace(resolvePostAuthRedirect(searchParams.get('next')));
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshTokenFromCookie();
      if (refreshToken) {
        try {
          await authService.logout({ refreshToken });
        } catch {
          // Clear local session even if revoke fails.
        }
      }
    },
    onSettled: () => {
      clearAuthSession();
      router.replace('/auth/login');
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
    onSuccess: (_result, variables) => {
      router.push(`/auth/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
    onSuccess: () => {
      router.replace('/auth/login?reset=1');
    },
  });
}
