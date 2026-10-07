'use client';

import { Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { AuthShell, AuthSwitch } from '../AuthShell';
import { ResetPasswordForm } from './forms/ResetPasswordForm';
import { useResetPassword } from '@/hooks/useAuthMutations';
import { getErrorMessage } from '@/lib/api/get-error-message';
import type { ResetPasswordFormValues } from './forms/reset-password.schema';

export function ResetPasswordPageClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const reset = useResetPassword();

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Enter the code from your email along with a new password."
      error={reset.isError ? getErrorMessage(reset.error, 'Unable to reset password') : null}
      footer={
        <AuthSwitch prompt="Need a new code?" href="/auth/forgot-password" label="Request again" />
      }
    >
      <ResetPasswordForm
        onSubmit={(values: ResetPasswordFormValues) =>
          reset.mutate({
            email: values.email,
            otp: values.otp,
            newPassword: values.newPassword,
          })
        }
        isSubmitting={reset.isPending}
        defaultEmail={email}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        In local development the OTP is typically <strong>123456</strong> when fixed mode is
        enabled on the API.
      </Typography>
    </AuthShell>
  );
}
