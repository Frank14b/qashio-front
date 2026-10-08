'use client';

import { Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { BudgetForm } from '../forms/BudgetForm';
import { toCreateBudgetsPayload, type BudgetFormValues } from '../forms/budget.schema';
import { useCreateBudgets } from '../hooks/useBudgetMutations';

export default function NewBudgetPage() {
  const router = useRouter();
  const createBudgets = useCreateBudgets();

  const handleSubmit = async (values: Readonly<BudgetFormValues>) => {
    await createBudgets.mutateAsync(toCreateBudgetsPayload(values));
    router.push('/budgets');
  };

  return (
    <FormPage
      title="Add budget"
      subtitle="Pick a wallet and one or more categories; each category gets its own budget with this limit."
    >
      {createBudgets.isError ? (
        <Alert severity="error">
          {getErrorMessage(createBudgets.error, 'Unable to create budget')}
        </Alert>
      ) : null}
      <BudgetForm
        onSubmit={(values) => void handleSubmit(values).catch(() => undefined)}
        onCancel={() => router.push('/budgets')}
        isSubmitting={createBudgets.isPending}
      />
    </FormPage>
  );
}
