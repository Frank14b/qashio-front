'use client';

import { Alert, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { TransactionForm } from '../forms/TransactionForm';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import type { TransactionFormValues } from '../forms/transaction.schema';

export default function NewTransactionPage() {
  const router = useRouter();
  const createTransaction = useCreateTransaction();

  const handleSubmit = (values: TransactionFormValues) => {
    createTransaction.mutate(
      {
        amount: values.amount,
        category: values.category,
        date: values.date.toISOString(),
        type: values.type,
        narration: values.narration,
      },
      {
        onSuccess: () => router.push('/transactions'),
      },
    );
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        New Transaction
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Add an income or expense entry
      </Typography>

      {createTransaction.isError ? (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 480 }}>
          Failed to create transaction. The API may not be ready yet.
        </Alert>
      ) : null}

      <TransactionForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/transactions')}
        isSubmitting={createTransaction.isPending}
      />
    </>
  );
}
