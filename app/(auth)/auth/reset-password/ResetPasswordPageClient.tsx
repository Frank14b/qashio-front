'use client';

import { Alert, Typography } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthShell, AuthSwitch } from '../AuthShell';
import { ResetPasswordForm } from './forms/ResetPasswordForm';
import { useResetPassword } from '@/hooks/useAuthMutations';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { readPasswordResetToken } from '../services/password-reset-token';
import type { ResetPasswordFormValues } from './forms/reset-password.schema';

export function ResetPasswordPageClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const reset = useResetPassword();
  // Read after mount: sessionStorage only exists in the browser.
  const [otpToken, setOtpToken] = useState<string | null | undefined>(undefined);
  useEffect(() => setOtpToken(readPasswordResetToken(email)), [email]);

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Enter the code from your email along with a new password."
      error={reset.isError ? getErrorMessage(reset.error, 'Unable to reset password') : null}
      footer={
        <AuthSwitch prompt="Need a new code?" href="/auth/forgot-password" label="Request again" />
      }
    >
      {otpToken === null ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This reset code can only be confirmed from the browser tab that requested it.{' '}
          <Link href="/auth/forgot-password">Request a new code</Link> here to continue.
        </Alert>
      ) : null}
      <ResetPasswordForm
        onSubmit={(values: ResetPasswordFormValues) => {
          // The email may have been edited; the token is tied to the requested address.
          const token = readPasswordResetToken(values.email);
          if (token) {
            reset.mutate({
              email: values.email,
              otp: values.otp,
              otpToken: token,
              newPassword: values.newPassword,
            });
          } else {
            setOtpToken(null);
          }
        }}
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
