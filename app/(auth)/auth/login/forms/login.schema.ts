import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email({ error: 'Enter a valid email' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(128, { error: 'Password is too long' }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const loginFormDefaults: LoginFormValues = {
  email: '',
  password: '',
};
