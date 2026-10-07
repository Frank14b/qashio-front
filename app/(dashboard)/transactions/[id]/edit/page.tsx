'use client';

import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

  if (transactionQuery.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (transactionQuery.isError || !transactionQuery.data) {
    return (
      <Stack spacing={2} maxWidth={560}>
        <Alert severity="error">
          {getErrorMessage(transactionQuery.error, 'Unable to load transaction')}
        </Alert>
        <Button component={Link} href="/transactions" variant="text" sx={{ alignSelf: 'flex-start' }}>
          Back to transactions
        </Button>
      </Stack>
    );
  }

  const transaction = transactionQuery.data;

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
          Edit transaction
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {transaction.reference}
        </Typography>
      </Box>

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
    </Stack>
  );
}
