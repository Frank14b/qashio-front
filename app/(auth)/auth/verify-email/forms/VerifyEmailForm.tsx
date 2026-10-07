'use client';

import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { Form, AppButton } from '@/app/components/ui';
import { FormInput } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import {
  verifyEmailFormDefaults,
  verifyEmailFormSchema,
  type VerifyEmailFormValues,
} from './verify-email.schema';

type VerifyEmailFormProps = {
  onSubmit: (values: VerifyEmailFormValues) => void;
  isSubmitting?: boolean;
  defaultEmail?: string;
};

export function VerifyEmailForm({
  onSubmit,
  isSubmitting = false,
  defaultEmail = '',
}: VerifyEmailFormProps) {
  const form = useZodForm({
    schema: verifyEmailFormSchema,
    defaultValues: { ...verifyEmailFormDefaults, email: defaultEmail },
  });

  useEffect(() => {
    if (defaultEmail) {
      form.setValue('email', defaultEmail);
    }
  }, [defaultEmail, form]);

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%" spacing={2}>
      <FormInput<VerifyEmailFormValues>
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <FormInput<VerifyEmailFormValues>
        name="otp"
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
      />
      <AppButton
        type="submit"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ height: 44, fontWeight: 600 }}
      >
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Verify and continue'}
      </AppButton>
    </Form>
  );
}
