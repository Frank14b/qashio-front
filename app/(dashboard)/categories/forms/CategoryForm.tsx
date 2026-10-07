'use client';

import { CircularProgress } from '@mui/material';
import { AppButton, Form, FormActions } from '@/app/components/ui';
import { FormInput, FormSelectField } from '@/app/components/forms/fields';
import { useZodForm } from '@/app/components/forms/useZodForm';
import {
  CATEGORY_KIND_OPTIONS,
  categoryFormDefaults,
  categoryFormSchema,
  type CategoryFormValues,
} from './category.schema';

type CategoryFormProps = {
  onSubmit: (values: Readonly<CategoryFormValues>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export function CategoryForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Readonly<CategoryFormProps>) {
  const form = useZodForm<CategoryFormValues>({
    schema: categoryFormSchema,
    defaultValues: categoryFormDefaults,
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} maxWidth="100%">
      <FormInput<CategoryFormValues>
        name="name"
        label="Category name"
        autoComplete="off"
        autoFocus
      />
      <FormSelectField<CategoryFormValues>
        name="kind"
        label="Used for"
        options={CATEGORY_KIND_OPTIONS}
      />
      <FormActions>
        {onCancel ? (
          <AppButton variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </AppButton>
        ) : null}
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Add category'}
        </AppButton>
      </FormActions>
    </Form>
  );
}
