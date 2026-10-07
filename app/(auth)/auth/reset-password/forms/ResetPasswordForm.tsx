'use client';

import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { Form, AppButton } from '@/app/components/ui';
import { FormInput } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { FormPasswordField } from '@/app/components/forms/fields';
import {
  resetPasswordFormDefaults,
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from './reset-password.schema';

type ResetPasswordFormProps = {
  onSubmit: (values: ResetPasswordFormValues) => void;
  isSubmitting?: boolean;
  defaultEmail?: string;
};

export function ResetPasswordForm({
  onSubmit,
  isSubmitting = false,
  defaultEmail = '',
}: ResetPasswordFormProps) {
  const form = useZodForm({
    schema: resetPasswordFormSchema,
    defaultValues: { ...resetPasswordFormDefaults, email: defaultEmail },
  });

  useEffect(() => {
    if (defaultEmail) {
      form.setValue('email', defaultEmail);
    }
  }, [defaultEmail, form]);

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%" spacing={2}>
      <FormInput<ResetPasswordFormValues>
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <FormInput<ResetPasswordFormValues>
        name="otp"
        label="Reset code"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
      />
      <FormPasswordField<ResetPasswordFormValues>
        name="newPassword"
        label="New password"
        autoComplete="new-password"
      />
      <FormPasswordField<ResetPasswordFormValues>
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
      />
      <AppButton
        type="submit"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ height: 44, fontWeight: 600 }}
      >
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Update password'}
      </AppButton>
    </Form>
  );
}
