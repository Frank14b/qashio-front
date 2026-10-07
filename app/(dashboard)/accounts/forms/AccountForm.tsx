'use client';

import { CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { Controller } from 'react-hook-form';
import { AppButton, Form, FormActions } from '@/app/components/ui';
import { FormInput, FormSelectField } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import { useCurrencies } from '../hooks/useCurrencies';
import {
  accountFormDefaults,
  accountFormSchema,
  type AccountFormValues,
} from './account.schema';

type AccountFormProps = {
  onSubmit: (values: AccountFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<AccountFormValues>;
  mode?: 'create' | 'edit';
  submitLabel?: string;
};

export function AccountForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
  mode = 'create',
  submitLabel,
}: AccountFormProps) {
  const currencies = useCurrencies();
  const form = useZodForm({
    schema: accountFormSchema,
    defaultValues: { ...accountFormDefaults, ...defaultValues },
  });

  const currencyOptions =
    currencies.data?.map((currency) => ({
      label: `${currency.code} — ${currency.name}`,
      value: currency.code,
    })) ?? [];

  const label = submitLabel ?? (mode === 'edit' ? 'Save changes' : 'Create wallet');

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%">
      <FormInput<AccountFormValues> name="name" label="Wallet name" autoComplete="off" autoFocus />
      <FormSelectField<AccountFormValues>
        name="currencyCode"
        label="Currency"
        options={currencyOptions}
        disabled={mode === 'edit' || currencies.isLoading || currencyOptions.length === 0}
      />
      <FormInput<AccountFormValues>
        name="openingBalance"
        label="Opening balance (before first transaction, can be negative)"
        autoComplete="off"
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      />
      <Controller
        name="isDefault"
        control={form.control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(_, checked) => field.onChange(checked)}
                color="primary"
              />
            }
            label="Set as default wallet"
          />
        )}
      />
      <FormActions>
        <AppButton type="submit" disabled={isSubmitting || currencies.isLoading}>
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : label}
        </AppButton>
      </FormActions>
    </Form>
  );
}
