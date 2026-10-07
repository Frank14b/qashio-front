import { z } from 'zod';

export const verifyEmailFormSchema = z.object({
  email: z.email({ error: 'Enter a valid email' }),
  otp: z
    .string()
    .length(6, { error: 'Enter the 6-digit code' })
    .regex(/^\d{6}$/, { error: 'Code must be 6 digits' }),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailFormSchema>;

export const verifyEmailFormDefaults: VerifyEmailFormValues = {
  email: '',
  otp: '',
};
