'use client';

import {
  Alert,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { AppButton, Form, FormActions } from '@/app/components/ui';
import { FormDatePickerField, FormInput, FormSelectField } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import {
  transactionFormDefaults,
  transactionFormSchema,
  type TransactionFormValues,
} from './transaction.schema';

export interface TransactionFormProps {
  onSubmit: (values: Readonly<TransactionFormValues>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  defaultValues?: Partial<TransactionFormValues>;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isSubmitting = false,
  defaultValues,
}: Readonly<TransactionFormProps>) {
  const accounts = useAccounts();
  const categories = useCategories();
  const form = useZodForm<TransactionFormValues>({
    schema: transactionFormSchema,
    defaultValues: { ...transactionFormDefaults, ...defaultValues },
  });
  const { control, getValues, setValue } = form;
  const type = useWatch({ control, name: 'type' });
  const accountId = useWatch({ control, name: 'accountId' });

  const accountOptions = useMemo(
    () =>
      (accounts.data ?? []).map((account) => ({
        label: `${account.name} · ${account.currencyCode}`,
        value: account.id,
      })),
    [accounts.data],
  );

  // Only categories usable for the selected direction (`both` fits either).
  const categoryOptions = useMemo(
    () =>
      (categories.data ?? [])
        .filter((category) => category.kind === 'both' || category.kind === type)
        .map((category) => ({ label: category.name, value: category.id })),
    [categories.data, type],
  );

  const currencyCode = accounts.data?.find((account) => account.id === accountId)?.currencyCode;

  // Pre-select the default wallet once wallets load.
  useEffect(() => {
    if (!getValues('accountId') && accounts.data?.length) {
      const preferred = accounts.data.find((account) => account.isDefault) ?? accounts.data[0];
      setValue('accountId', preferred.id);
    }
  }, [accounts.data, getValues, setValue]);

  // Switching income ↔ expense clears a category that no longer fits.
  useEffect(() => {
    const current = getValues('categoryId');
    if (current && categories.data && !categoryOptions.some((o) => o.value === current)) {
      setValue('categoryId', '');
    }
  }, [categoryOptions, categories.data, getValues, setValue]);

  const isLoadingOptions = accounts.isLoading || categories.isLoading;
  const noWallets = !accounts.isLoading && accountOptions.length === 0;

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth={520}>
      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => (
          <Stack spacing={0.5}>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={field.value}
              onChange={(_, value: TransactionFormValues['type'] | null) => {
                if (value) field.onChange(value);
              }}
              aria-label="Transaction type"
            >
              <ToggleButton value="expense" color="error" aria-label="Expense (money out)">
                Expense · money out
              </ToggleButton>
              <ToggleButton value="income" color="success" aria-label="Income (money in)">
                Income · money in
              </ToggleButton>
            </ToggleButtonGroup>
            {fieldState.error ? (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            ) : null}
          </Stack>
        )}
      />

      {noWallets ? (
        <Alert severity="warning">Create a wallet first to record transactions.</Alert>
      ) : null}
      {accounts.isError || categories.isError ? (
        <Alert severity="error">Unable to load wallets or categories.</Alert>
      ) : null}

      <FormSelectField<TransactionFormValues>
        name="accountId"
        label="Wallet"
        options={accountOptions}
        disabled={isLoadingOptions || noWallets}
      />
      <FormSelectField<TransactionFormValues>
        name="categoryId"
        label="Category"
        options={categoryOptions}
        disabled={isLoadingOptions}
      />
      <FormInput<TransactionFormValues>
        name="amount"
        label="Amount"
        autoComplete="off"
        slotProps={{
          htmlInput: { inputMode: 'decimal' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  component="span"
                  sx={{ fontWeight: 700, color: type === 'income' ? 'success.main' : 'error.main' }}
                >
                  {type === 'income' ? '+' : '−'}
                </Typography>
              </InputAdornment>
            ),
            endAdornment: currencyCode ? (
              <InputAdornment position="end">{currencyCode}</InputAdornment>
            ) : undefined,
          },
        }}
      />
      <FormDatePickerField<TransactionFormValues> name="date" label="Date" disableFuture />
      <FormInput<TransactionFormValues>
        name="counterparty"
        label={type === 'income' ? 'Received from' : 'Paid to'}
        autoComplete="off"
      />
      <FormInput<TransactionFormValues> name="narration" label="Narration" multiline rows={3} />
      <FormActions>
        {onCancel ? (
          <AppButton variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </AppButton>
        ) : null}
        <AppButton
          type="submit"
          color={type === 'income' ? 'success' : 'primary'}
          disabled={isSubmitting || isLoadingOptions || noWallets}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : submitLabel}
        </AppButton>
      </FormActions>
    </Form>
  );
}

/** Form values → API payload (shared by create and edit pages). */
export function toTransactionPayload(values: Readonly<TransactionFormValues>) {
  return {
    type: values.type,
    accountId: values.accountId,
    categoryId: values.categoryId,
    amount: values.amount,
    occurredAt: values.date.toISOString(),
    counterparty: values.counterparty || null,
    narration: values.narration || null,
  };
}
