'use client';

import { Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { CategoryForm } from '../forms/CategoryForm';
import type { CategoryFormValues } from '../forms/category.schema';
import { useCreateCategory } from '../hooks/useCreateCategory';

export default function NewCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  const handleSubmit = async (values: Readonly<CategoryFormValues>) => {
    await createCategory.mutateAsync(values);
    router.push('/categories');
  };

  return (
    <FormPage
      title="Add category"
      subtitle="Expense categories can be budgeted; income categories label money coming in."
    >
      {createCategory.isError ? (
        <Alert severity="error">
          {getErrorMessage(createCategory.error, 'Unable to create category')}
        </Alert>
      ) : null}
      <CategoryForm
        onSubmit={(values) => void handleSubmit(values).catch(() => undefined)}
        onCancel={() => router.push('/categories')}
        isSubmitting={createCategory.isPending}
      />
    </FormPage>
  );
}
