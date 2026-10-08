import { z } from 'zod';
import type { CreateBudgetsPayload, UpdateBudgetPayload } from '../types';

export const budgetFormSchema = z.object({
  accountId: z.string().min(1, { error: 'Choose a wallet' }),
  /** One budget is created per selected category. */
  categoryIds: z.array(z.string()).min(1, { error: 'Choose at least one category' }),
  // Kept as a string end-to-end so money never goes through float math.
  amount: z
    .string()
    .trim()
    .min(1, { error: 'Limit is required' })
    .regex(/^\d+(\.\d{1,4})?$/, { error: 'Enter a valid amount, e.g. 500.00' })
    .refine((value) => /[1-9]/.test(value), { error: 'Limit must be greater than 0' }),
  period: z.enum(['weekly', 'monthly', 'yearly'], { error: 'Choose a period' }),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export const budgetFormDefaults: BudgetFormValues = {
  accountId: '',
  categoryIds: [],
  amount: '',
  period: 'monthly',
};

export const BUDGET_PERIOD_OPTIONS = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

export function toCreateBudgetsPayload(values: Readonly<BudgetFormValues>): CreateBudgetsPayload {
  return {
    accountId: values.accountId,
    categoryIds: values.categoryIds,
    amount: values.amount,
    period: values.period,
  };
}

/** Only the limit and period can change after creation. */
export function toUpdateBudgetPayload(values: Readonly<BudgetFormValues>): UpdateBudgetPayload {
  return { amount: values.amount, period: values.period };
}
