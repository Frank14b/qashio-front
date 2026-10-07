'use client';

import { Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { AuthShell, AuthSwitch } from '../AuthShell';
import { VerifyEmailForm } from './forms/VerifyEmailForm';
import { useVerifyEmail } from '@/hooks/useAuthMutations';
import { getErrorMessage } from '@/lib/api/get-error-message';
import type { VerifyEmailFormValues } from './forms/verify-email.schema';

export function VerifyEmailPageClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const verify = useVerifyEmail();

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Enter the 6-digit code sent to your inbox to activate your account."
      error={verify.isError ? getErrorMessage(verify.error, 'Verification failed') : null}
      footer={<AuthSwitch prompt="Wrong email?" href="/auth/register" label="Register again" />}
    >
      <VerifyEmailForm
        onSubmit={(values: VerifyEmailFormValues) => verify.mutate(values)}
        isSubmitting={verify.isPending}
        defaultEmail={email}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        In local development the OTP is typically <strong>123456</strong> when fixed mode is
        enabled on the API.
      </Typography>
    </AuthShell>
  );
}
