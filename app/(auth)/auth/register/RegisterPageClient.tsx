'use client';

import { AuthShell, AuthSwitch } from '../AuthShell';
import { RegisterForm } from './forms/RegisterForm';
import { useRegister } from '@/hooks/useAuthMutations';
import { getErrorMessage } from '@/lib/api/get-error-message';
import type { RegisterFormValues } from './forms/register.schema';

export function RegisterPageClient() {
  const register = useRegister();

  return (
    <AuthShell
      title="Create your account"
      subtitle="A few details, then we verify your email."
      error={register.isError ? getErrorMessage(register.error, 'Unable to create account') : null}
      footer={<AuthSwitch prompt="Already have an account?" href="/auth/login" label="Sign in" />}
    >
      <RegisterForm
        onSubmit={(values: RegisterFormValues) => register.mutate(values)}
        isSubmitting={register.isPending}
      />
    </AuthShell>
  );
}
