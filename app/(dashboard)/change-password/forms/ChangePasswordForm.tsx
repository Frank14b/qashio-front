'use client';

import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { Form, AppButton } from '@/app/components/ui';
import { FormInput, FormPasswordField } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { useAuthStore } from '@/stores/authStore';
import { useChangePasswordConfirm } from '../hooks/useChangePasswordConfirm';
import { useChangePasswordRequest } from '../hooks/useChangePasswordRequest';
import {
  changePasswordConfirmDefaults,
  changePasswordConfirmSchema,
  changePasswordRequestDefaults,
  changePasswordRequestSchema,
  type ChangePasswordConfirmFormValues,
  type ChangePasswordRequestFormValues,
} from './change-password.schema';

export function ChangePasswordForm() {
  const user = useAuthStore((s) => s.user);
  const requestChange = useChangePasswordRequest();
  const confirmChange = useChangePasswordConfirm();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [notice, setNotice] = useState<string | null>(null);

  const requestForm = useZodForm({
    schema: changePasswordRequestSchema,
    defaultValues: {
      ...changePasswordRequestDefaults,
      email: user?.email ?? '',
    },
  });

  const confirmForm = useZodForm({
    schema: changePasswordConfirmSchema,
    defaultValues: {
      ...changePasswordConfirmDefaults,
      email: user?.email ?? '',
    },
  });

  const error =
    (requestChange.isError
      ? getErrorMessage(requestChange.error, 'Unable to request password change')
      : null) ||
    (confirmChange.isError
      ? getErrorMessage(confirmChange.error, 'Unable to confirm password change')
      : null);

  const onRequest = requestForm.handleSubmit(async (values: ChangePasswordRequestFormValues) => {
    setNotice(null);
    const result = await requestChange.mutateAsync(values);
    setNotice(result.message);
    confirmForm.setValue('email', values.email);
    setStep('confirm');
  });

  const onConfirm = confirmForm.handleSubmit(async (values: ChangePasswordConfirmFormValues) => {
    setNotice(null);
    const result = await confirmChange.mutateAsync({
      email: values.email,
      otp: values.otp,
      newPassword: values.newPassword,
    });
    setNotice(result.message);
    setStep('request');
    requestForm.reset({
      email: values.email,
      currentPassword: '',
    });
    confirmForm.reset({
      email: values.email,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });
  });

  return (
    <Stack spacing={3} maxWidth={520}>
      <Box>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '2.25rem' },
          }}
        >
          Change password
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Confirm your current password, then enter the email code and a new password.
        </Typography>
      </Box>

      {notice ? <Alert severity="success">{notice}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      {step === 'request' ? (
        <Form form={requestForm} onSubmit={onRequest} maxWidth="100%" spacing={2}>
          <FormInput<ChangePasswordRequestFormValues>
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <FormPasswordField<ChangePasswordRequestFormValues>
            name="currentPassword"
            label="Current password"
            autoComplete="current-password"
          />
          <AppButton type="submit" disabled={requestChange.isPending} sx={{ height: 44 }}>
            {requestChange.isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Send verification code'
            )}
          </AppButton>
        </Form>
      ) : (
        <Stack spacing={2}>
          <Typography color="text.secondary" variant="body2">
            Step 2 of 2 — enter the code and your new password.
          </Typography>
          <Form form={confirmForm} onSubmit={onConfirm} maxWidth="100%" spacing={2}>
            <FormInput<ChangePasswordConfirmFormValues>
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
            />
            <FormInput<ChangePasswordConfirmFormValues>
              name="otp"
              label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
            />
            <FormPasswordField<ChangePasswordConfirmFormValues>
              name="newPassword"
              label="New password"
              autoComplete="new-password"
            />
            <FormPasswordField<ChangePasswordConfirmFormValues>
              name="confirmPassword"
              label="Confirm new password"
              autoComplete="new-password"
            />
            <Typography variant="body2" color="text.secondary">
              In local development the OTP is often <strong>123456</strong>.
            </Typography>
            <AppButton type="submit" disabled={confirmChange.isPending} sx={{ height: 44 }}>
              {confirmChange.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Save new password'
              )}
            </AppButton>
            <AppButton
              type="button"
              variant="text"
              onClick={() => setStep('request')}
              disabled={confirmChange.isPending}
            >
              Back
            </AppButton>
          </Form>
        </Stack>
      )}

      <AppButton component={Link} href="/dashboard" variant="text" sx={{ alignSelf: 'flex-start' }}>
        Back to dashboard
      </AppButton>
    </Stack>
  );
}
