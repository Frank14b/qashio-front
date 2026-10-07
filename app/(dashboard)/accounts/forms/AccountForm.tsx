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
};

export function AccountForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
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

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth={480}>
      <FormInput<AccountFormValues> name="name" label="Wallet name" autoComplete="off" autoFocus />
      <FormSelectField<AccountFormValues>
        name="currencyCode"
        label="Currency"
        options={currencyOptions}
        disabled={currencies.isLoading || currencyOptions.length === 0}
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
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Create wallet'}
        </AppButton>
      </FormActions>
    </Form>
  );
}
