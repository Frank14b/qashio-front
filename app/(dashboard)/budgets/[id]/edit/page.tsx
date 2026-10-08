'use client';

import { Alert, Box, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { BudgetForm } from '../../forms/BudgetForm';
import { toUpdateBudgetPayload, type BudgetFormValues } from '../../forms/budget.schema';
import { useUpdateBudget } from '../../hooks/useBudgetMutations';
import { useBudget } from '../../hooks/useBudgets';

export default function EditBudgetPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const budgetQuery = useBudget(id);
  const updateBudget = useUpdateBudget();

  const handleSubmit = async (values: Readonly<BudgetFormValues>) => {
    await updateBudget.mutateAsync({ id, payload: toUpdateBudgetPayload(values) });
    router.push('/budgets');
  };

  const budget = budgetQuery.data;

  return (
    <FormPage
      title="Edit budget"
      subtitle="Change the limit or period. To budget another wallet or category, add a new budget."
    >
      {budgetQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : !budget ? (
        <>
          <Alert severity="error">{getErrorMessage(budgetQuery.error, 'Unable to load budget')}</Alert>
          <Button component={Link} href="/budgets" sx={{ alignSelf: 'flex-start' }}>
            Back to budgets
          </Button>
        </>
      ) : (
        <>
          {updateBudget.isError ? (
            <Alert severity="error">
              {getErrorMessage(updateBudget.error, 'Unable to update budget')}
            </Alert>
          ) : null}
          <BudgetForm
            mode="edit"
            defaultValues={{
              accountId: budget.account.id,
              categoryIds: [budget.category.id],
              amount: budget.amount,
              period: budget.period,
            }}
            onSubmit={(values) => void handleSubmit(values).catch(() => undefined)}
            onCancel={() => router.push('/budgets')}
            isSubmitting={updateBudget.isPending}
          />
        </>
      )}
    </FormPage>
  );
}
