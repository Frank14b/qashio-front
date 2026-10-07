'use client';

import { AuthShell, AuthSwitch } from '../AuthShell';
import { ForgotPasswordForm } from './forms/ForgotPasswordForm';
import { useForgotPassword } from '@/hooks/useAuthMutations';
import { getErrorMessage } from '@/lib/api/get-error-message';
import type { ForgotPasswordFormValues } from './forms/forgot-password.schema';

export function ForgotPasswordPageClient() {
  const forgot = useForgotPassword();

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We will email a one-time code so you can choose a new password."
      error={forgot.isError ? getErrorMessage(forgot.error, 'Unable to request reset') : null}
      footer={<AuthSwitch prompt="Remembered it?" href="/auth/login" label="Back to sign in" />}
    >
      <ForgotPasswordForm
        onSubmit={(values: ForgotPasswordFormValues) => forgot.mutate(values)}
        isSubmitting={forgot.isPending}
      />
    </AuthShell>
  );
}
