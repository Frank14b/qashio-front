import { z } from 'zod';

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense'], {
    error: 'Type is required',
  }),
  accountId: z.string().min(1, { error: 'Select a wallet' }),
  categoryId: z.string().min(1, { error: 'Category is required' }),
  // Kept as a string end-to-end so money never goes through float math.
  amount: z
    .string()
    .trim()
    .min(1, { error: 'Amount is required' })
    .regex(/^\d+(\.\d{1,4})?$/, { error: 'Enter a valid amount, e.g. 42.50' })
    .refine((value) => /[1-9]/.test(value), { error: 'Amount must be greater than 0' }),
  date: z.coerce.date({
    error: (issue) =>
      issue.input === undefined || issue.input === null ? 'Date is required' : 'Invalid date',
  }),
  counterparty: z.string().trim().max(160, { error: 'Counterparty is too long' }),
  narration: z.string().trim().max(1000, { error: 'Narration is too long' }),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transactionFormDefaults: TransactionFormValues = {
  type: 'expense',
  accountId: '',
  categoryId: '',
  amount: '',
  date: new Date(),
  counterparty: '',
  narration: '',
};

export const TRANSACTION_TYPE_OPTIONS = [
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
];
