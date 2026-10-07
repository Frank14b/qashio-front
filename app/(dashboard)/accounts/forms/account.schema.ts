import { z } from 'zod';

export const accountFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Name is required' })
    .max(120, { error: 'Name is too long' }),
  currencyCode: z.string().trim().length(3, { error: 'Select a currency' }),
  isDefault: z.boolean(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const accountFormDefaults: AccountFormValues = {
  name: '',
  currencyCode: 'USD',
  isDefault: false,
};
