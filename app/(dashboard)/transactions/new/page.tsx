'use client';

import { Alert, Box, CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { TransactionForm, toTransactionPayload } from '../forms/TransactionForm';
import type { TransactionFormValues } from '../forms/transaction.schema';
import { useCreateTransaction } from '../hooks/useCreateTransaction';

const COPY = {
  income: { title: 'Add income', subtitle: 'Record money coming into a wallet.', submit: 'Add income' },
  expense: {
    title: 'Add expense',
    subtitle: 'Record money going out of a wallet.',
    submit: 'Add expense',
  },
} as const;

function NewTransactionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createTransaction = useCreateTransaction();
  const type = searchParams.get('type') === 'income' ? 'income' : 'expense';
  const copy = COPY[type];

  const handleSubmit = async (values: Readonly<TransactionFormValues>) => {
    await createTransaction.mutateAsync(toTransactionPayload(values));
    router.push('/transactions');
  };

  return (
    <FormPage
      title={copy.title}
      subtitle={`${copy.subtitle} You can switch between income and expense below.`}
    >
      {createTransaction.isError ? (
        <Alert severity="error">
          {getErrorMessage(createTransaction.error, 'Unable to save transaction')}
        </Alert>
      ) : null}

      {/* key re-mounts the form when switching ?type= from the header buttons */}
      <TransactionForm
        key={type}
        defaultValues={{ type }}
        submitLabel={copy.submit}
        onSubmit={(values) => void handleSubmit(values).catch(() => undefined)}
        onCancel={() => router.push('/transactions')}
        isSubmitting={createTransaction.isPending}
      />
    </FormPage>
  );
}

export default function NewTransactionPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      }
    >
      <NewTransactionContent />
    </Suspense>
  );
}
