import { z } from 'zod';

export const resetPasswordFormSchema = z
  .object({
    email: z.email({ error: 'Enter a valid email' }),
    otp: z
      .string()
      .length(6, { error: 'Enter the 6-digit code' })
      .regex(/^\d{6}$/, { error: 'Code must be 6 digits' }),
    newPassword: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .max(128, { error: 'Password is too long' }),
    confirmPassword: z.string().min(1, { error: 'Confirm your password' }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export const resetPasswordFormDefaults: ResetPasswordFormValues = {
  email: '',
  otp: '',
  newPassword: '',
  confirmPassword: '',
};
