'use client';

import { Alert, CircularProgress, InputAdornment } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { AppButton, Form, FormActions } from '@/app/components/ui';
import { FormInput, FormSelectField } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import {
  BUDGET_PERIOD_OPTIONS,
  budgetFormDefaults,
  budgetFormSchema,
  type BudgetFormValues,
} from './budget.schema';

type BudgetFormProps = {
  onSubmit: (values: Readonly<BudgetFormValues>) => void;
  onCancel?: () => void;
  /** `edit`: wallet and category are locked, as in the API. */
  mode?: 'create' | 'edit';
  defaultValues?: Partial<BudgetFormValues>;
  isSubmitting?: boolean;
};

export function BudgetForm({
  onSubmit,
  onCancel,
  mode = 'create',
  defaultValues,
  isSubmitting = false,
}: Readonly<BudgetFormProps>) {
  const accounts = useAccounts();
  const categories = useCategories();
  const form = useZodForm<BudgetFormValues>({
    schema: budgetFormSchema,
    defaultValues: { ...budgetFormDefaults, ...defaultValues },
  });
  const { control, getValues, setValue } = form;
  const accountId = useWatch({ control, name: 'accountId' });
  const locked = mode === 'edit';

  const walletOptions = useMemo(
    () =>
      (accounts.data ?? []).map((account) => ({
        label: `${account.name} · ${account.currencyCode}`,
        value: account.id,
      })),
    [accounts.data],
  );
  // Budgets track spending, so income-only categories are left out.
  const categoryOptions = useMemo(
    () =>
      (categories.data ?? [])
        .filter((category) => category.kind !== 'income')
        .map((category) => ({ label: category.name, value: category.id })),
    [categories.data],
  );
  const categoryNames = useMemo(
    () => new Map(categoryOptions.map((option) => [option.value, option.label])),
    [categoryOptions],
  );
  const currencyCode = accounts.data?.find((account) => account.id === accountId)?.currencyCode;

  // New budgets default to the user's default wallet.
  useEffect(() => {
    if (!locked && !getValues('accountId') && accounts.data?.length) {
      const preferred = accounts.data.find((account) => account.isDefault) ?? accounts.data[0];
      setValue('accountId', preferred.id);
    }
  }, [accounts.data, getValues, locked, setValue]);

  const isLoading = accounts.isLoading || categories.isLoading;
  const noWallets = !accounts.isLoading && walletOptions.length === 0;

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%">
      {noWallets ? <Alert severity="warning">Create a wallet first to set a budget.</Alert> : null}
      <FormSelectField<BudgetFormValues>
        name="accountId"
        label="Wallet"
        options={walletOptions}
        disabled={locked || isLoading || noWallets}
      />
      <FormSelectField<BudgetFormValues>
        name="categoryIds"
        label={locked ? 'Category' : 'Categories (one budget each)'}
        options={categoryOptions}
        multiple
        renderValue={(selected) =>
          (selected as string[]).map((id) => categoryNames.get(id) ?? '').join(', ')
        }
        disabled={locked || isLoading}
      />
      <FormInput<BudgetFormValues>
        name="amount"
        label={locked ? 'Spending limit' : 'Spending limit (per category)'}
        autoComplete="off"
        slotProps={{
          htmlInput: { inputMode: 'decimal' },
          input: {
            endAdornment: currencyCode ? (
              <InputAdornment position="end">{currencyCode}</InputAdornment>
            ) : undefined,
          },
        }}
      />
      <FormSelectField<BudgetFormValues> name="period" label="Every" options={BUDGET_PERIOD_OPTIONS} />
      <FormActions>
        {onCancel ? (
          <AppButton variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </AppButton>
        ) : null}
        <AppButton type="submit" disabled={isSubmitting || isLoading || noWallets}>
          {isSubmitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : locked ? (
            'Save changes'
          ) : (
            'Create budgets'
          )}
        </AppButton>
      </FormActions>
    </Form>
  );
}
