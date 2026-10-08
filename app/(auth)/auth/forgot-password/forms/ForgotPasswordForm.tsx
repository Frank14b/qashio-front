'use client';

import { CircularProgress } from '@mui/material';
import { Form, AppButton } from '@/app/components/ui';
import { FormInput } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import {
  forgotPasswordFormDefaults,
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from './forgot-password.schema';

type ForgotPasswordFormProps = {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  isSubmitting?: boolean;
};

export function ForgotPasswordForm({ onSubmit, isSubmitting = false }: ForgotPasswordFormProps) {
  const form = useZodForm({
    schema: forgotPasswordFormSchema,
    defaultValues: forgotPasswordFormDefaults,
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%" spacing={2}>
      <FormInput<ForgotPasswordFormValues>
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
      />
      <AppButton
        type="submit"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ height: 44, fontWeight: 600 }}
      >
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Send reset code'}
      </AppButton>
    </Form>
  );
}
