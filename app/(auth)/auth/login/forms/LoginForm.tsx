'use client';

import { CircularProgress, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { Form, AppButton } from '@/app/components/ui';
import { FormInput } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { FormPasswordField } from '@/app/components/forms/fields';
import { loginFormDefaults, loginFormSchema, type LoginFormValues } from './login.schema';

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting?: boolean;
};

export function LoginForm({ onSubmit, isSubmitting = false }: LoginFormProps) {
  const form = useZodForm({ schema: loginFormSchema, defaultValues: loginFormDefaults });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%" spacing={2}>
      <FormInput<LoginFormValues>
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
      />
      <FormPasswordField<LoginFormValues> name="password" label="Password" />
      <MuiLink
        component={Link}
        href="/auth/forgot-password"
        underline="hover"
        sx={{ alignSelf: 'flex-end', fontSize: '0.875rem', fontWeight: 600 }}
      >
        Forgot password?
      </MuiLink>
      <AppButton
        type="submit"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 0.5, height: 44, fontWeight: 600 }}
      >
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
      </AppButton>
    </Form>
  );
}
