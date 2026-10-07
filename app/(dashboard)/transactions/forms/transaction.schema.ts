import { z } from 'zod';

export const transactionFormSchema = z.object({
  amount: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined || issue.input === ''
          ? 'Amount is required'
          : 'Amount must be a number',
    })
    .positive({ error: 'Amount must be greater than 0' }),
  category: z.string().min(1, { error: 'Category is required' }),
  date: z.coerce.date({
    error: (issue) =>
      issue.input === undefined || issue.input === null ? 'Date is required' : 'Invalid date',
  }),
  type: z.enum(['income', 'expense'], {
    error: 'Type is required',
  }),
  narration: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transactionFormDefaults: TransactionFormValues = {
  amount: 0,
  category: '',
  date: new Date(),
  type: 'expense',
  narration: '',
};

export const TRANSACTION_TYPE_OPTIONS = [
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  { label: 'Utilities', value: 'Utilities' },
  { label: 'IT Services', value: 'IT Services' },
  { label: 'Office Supplies', value: 'Office Supplies' },
  { label: 'Software', value: 'Software' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Other', value: 'Other' },
];
