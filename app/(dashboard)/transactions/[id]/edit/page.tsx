'use client';

import { Alert, Box, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { TransactionForm, toTransactionPayload } from '../../forms/TransactionForm';
import type { TransactionFormValues } from '../../forms/transaction.schema';
import { useTransaction } from '../../hooks/useTransaction';
import { useUpdateTransaction } from '../../hooks/useUpdateTransaction';

export default function EditTransactionPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const transactionQuery = useTransaction(id);
  const updateTransaction = useUpdateTransaction();

  const handleSubmit = async (values: Readonly<TransactionFormValues>) => {
    await updateTransaction.mutateAsync({ id, payload: toTransactionPayload(values) });
    router.push('/transactions');
  };

  const transaction = transactionQuery.data;

  return (
    <FormPage title="Edit transaction" subtitle={transaction?.reference}>
      {transactionQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : !transaction ? (
        <>
          <Alert severity="error">
            {getErrorMessage(transactionQuery.error, 'Unable to load transaction')}
          </Alert>
          <Button component={Link} href="/transactions" sx={{ alignSelf: 'flex-start' }}>
            Back to transactions
          </Button>
        </>
      ) : (
        <>
          {updateTransaction.isError ? (
            <Alert severity="error">
              {getErrorMessage(updateTransaction.error, 'Unable to update transaction')}
            </Alert>
          ) : null}
          <TransactionForm
            defaultValues={{
              type: transaction.type,
              accountId: transaction.account.id,
              categoryId: transaction.category.id,
              amount: transaction.amount,
              date: new Date(transaction.occurredAt),
              counterparty: transaction.counterparty ?? '',
              narration: transaction.narration ?? '',
            }}
            submitLabel="Save changes"
            onSubmit={(values) => void handleSubmit(values).catch(() => undefined)}
            onCancel={() => router.push('/transactions')}
            isSubmitting={updateTransaction.isPending}
          />
        </>
      )}
    </FormPage>
  );
}
