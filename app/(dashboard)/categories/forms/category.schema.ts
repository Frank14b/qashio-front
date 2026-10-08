import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Name is required' })
    .max(120, { error: 'Name is too long' }),
  kind: z.enum(['expense', 'income', 'both'], { error: 'Choose what this category is for' }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormDefaults: CategoryFormValues = { name: '', kind: 'expense' };

export const CATEGORY_KIND_OPTIONS = [
  { label: 'Expense (money out)', value: 'expense' },
  { label: 'Income (money in)', value: 'income' },
  { label: 'Both', value: 'both' },
];
