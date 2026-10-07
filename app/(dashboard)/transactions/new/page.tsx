'use client';

import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { TransactionForm, toTransactionPayload } from '../forms/TransactionForm';
import type { TransactionFormValues } from '../forms/transaction.schema';
import { useCreateTransaction } from '../hooks/useCreateTransaction';

const COPY = {
  income: { title: 'Add income', subtitle: 'Record money coming into a wallet.', submit: 'Add income' },
  expense: { title: 'Add expense', subtitle: 'Record money going out of a wallet.', submit: 'Add expense' },
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
    <Stack spacing={3} maxWidth={560}>
      <Box>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '2.25rem' },
          }}
        >
          {copy.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {copy.subtitle} You can switch between income and expense below.
        </Typography>
      </Box>

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

      <Button component={Link} href="/transactions" variant="text" sx={{ alignSelf: 'flex-start' }}>
        Back to transactions
      </Button>
    </Stack>
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
