'use client';

import { useSearchParams } from 'next/navigation';
import { AuthShell, AuthSwitch } from '../AuthShell';
import { LoginForm } from './forms/LoginForm';
import { useLogin } from '@/hooks/useAuthMutations';
import { getErrorMessage } from '@/lib/api/get-error-message';
import type { LoginFormValues } from './forms/login.schema';

export function LoginPageClient() {
  const searchParams = useSearchParams();
  const login = useLogin();
  const resetNotice =
    searchParams.get('reset') === '1'
      ? 'Password updated. Sign in with your new password.'
      : null;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      notice={resetNotice}
      error={login.isError ? getErrorMessage(login.error, 'Unable to sign in') : null}
      footer={<AuthSwitch prompt="New here?" href="/auth/register" label="Create an account" />}
    >
      <LoginForm
        onSubmit={(values: LoginFormValues) => login.mutate(values)}
        isSubmitting={login.isPending}
      />
    </AuthShell>
  );
}
