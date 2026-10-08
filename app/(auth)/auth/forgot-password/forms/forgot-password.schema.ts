import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.email({ error: 'Enter a valid email' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const forgotPasswordFormDefaults: ForgotPasswordFormValues = {
  email: '',
};
