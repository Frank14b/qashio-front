import { z } from 'zod';

export const accountFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Name is required' })
    .max(120, { error: 'Name is too long' }),
  currencyCode: z.string().trim().length(3, { error: 'Select a currency' }),
  isDefault: z.boolean(),
  // String keeps the exact decimal; negative allowed (e.g. a credit card balance).
  openingBalance: z
    .string()
    .trim()
    .regex(/^-?\d+(\.\d{1,4})?$/, { error: 'Enter a valid amount, e.g. 1500.00 or -250' }),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const accountFormDefaults: AccountFormValues = {
  name: '',
  currencyCode: 'USD',
  isDefault: false,
  openingBalance: '0',
};
