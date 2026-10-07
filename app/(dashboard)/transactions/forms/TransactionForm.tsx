'use client';

import { AppButton, Form, FormActions } from '@/app/components/ui';
import { FormDatePickerField, FormInput, FormSelectField } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  transactionFormDefaults,
  transactionFormSchema,
  type TransactionFormValues,
} from './transaction.schema';

export interface TransactionFormProps {
  onSubmit: (values: Readonly<TransactionFormValues>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  defaultValues?: TransactionFormValues;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  submitLabel = 'Create',
  isSubmitting = false,
  defaultValues = transactionFormDefaults,
}: Readonly<TransactionFormProps>) {
  const form = useZodForm<TransactionFormValues>({
    schema: transactionFormSchema,
    defaultValues,
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <FormSelectField<TransactionFormValues>
        name="type"
        label="Type"
        options={TRANSACTION_TYPE_OPTIONS}
      />
      <FormSelectField<TransactionFormValues>
        name="category"
        label="Category"
        options={TRANSACTION_CATEGORY_OPTIONS}
      />
      <FormInput<TransactionFormValues> name="amount" label="Amount" type="number" />
      <FormDatePickerField<TransactionFormValues> name="date" label="Date" />
      <FormInput<TransactionFormValues> name="narration" label="Narration" multiline rows={3} />
      <FormActions>
        {onCancel ? (
          <AppButton variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </AppButton>
        ) : null}
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </AppButton>
      </FormActions>
    </Form>
  );
}
