'use client';

import { CircularProgress } from '@mui/material';
import { Form, AppButton } from '@/app/components/ui';
import { FormInput } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { FormPasswordField } from '@/app/components/forms/fields';
import {
  registerFormDefaults,
  registerFormSchema,
  type RegisterFormValues,
} from './register.schema';

type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => void;
  isSubmitting?: boolean;
};

export function RegisterForm({ onSubmit, isSubmitting = false }: RegisterFormProps) {
  const form = useZodForm({ schema: registerFormSchema, defaultValues: registerFormDefaults });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%" spacing={2}>
      <FormInput<RegisterFormValues>
        name="displayName"
        label="Display name"
        autoComplete="name"
        autoFocus
      />
      <FormInput<RegisterFormValues> name="email" label="Email" type="email" autoComplete="email" />
      <FormPasswordField<RegisterFormValues>
        name="password"
        label="Password"
        autoComplete="new-password"
      />
      <AppButton
        type="submit"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ height: 44, fontWeight: 600 }}
      >
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Continue'}
      </AppButton>
    </Form>
  );
}
