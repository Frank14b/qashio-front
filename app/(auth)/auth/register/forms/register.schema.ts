import { z } from 'zod';

export const registerFormSchema = z.object({
  displayName: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(120, { error: 'Name is too long' }),
  email: z.email({ error: 'Enter a valid email' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(128, { error: 'Password is too long' }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const registerFormDefaults: RegisterFormValues = {
  displayName: '',
  email: '',
  password: '',
};
