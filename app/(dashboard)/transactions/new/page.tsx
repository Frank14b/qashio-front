'use client';

import { Alert, Box, CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { TransactionForm, toTransactionPayload } from '../forms/TransactionForm';
import type { TransactionFormValues } from '../forms/transaction.schema';
import {
  PossibleDuplicateDialog,
  getPossibleDuplicate,
} from '../components/PossibleDuplicateDialog';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import { useIdempotencyKey } from '../hooks/useIdempotencyKey';
import type { CreateTransactionPayload, PossibleDuplicate } from '../types';

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
  const idempotencyKeyFor = useIdempotencyKey<CreateTransactionPayload>();
  const [pendingDuplicate, setPendingDuplicate] = useState<{
    payload: CreateTransactionPayload;
    duplicateOf: PossibleDuplicate;
  } | null>(null);
  const type = searchParams.get('type') === 'income' ? 'income' : 'expense';
  const copy = COPY[type];

  const save = async (payload: CreateTransactionPayload, confirmDuplicate = false) => {
    try {
      await createTransaction.mutateAsync({
        payload,
        idempotencyKey: idempotencyKeyFor(payload),
        confirmDuplicate,
      });
      setPendingDuplicate(null);
      router.push('/transactions');
    } catch (error) {
      const duplicateOf = getPossibleDuplicate(error);
      setPendingDuplicate(duplicateOf ? { payload, duplicateOf } : null);
    }
  };

  const handleSubmit = (values: Readonly<TransactionFormValues>) =>
    save(toTransactionPayload(values));

  return (
    <FormPage
      title={copy.title}
      subtitle={`${copy.subtitle} You can switch between income and expense below.`}
    >
      {createTransaction.isError && !getPossibleDuplicate(createTransaction.error) ? (
        <Alert severity="error">
          {getErrorMessage(createTransaction.error, 'Unable to save transaction')}
        </Alert>
      ) : null}

      {/* key re-mounts the form when switching ?type= from the header buttons */}
      <TransactionForm
        key={type}
        defaultValues={{ type }}
        submitLabel={copy.submit}
        onSubmit={(values) => void handleSubmit(values)}
        onCancel={() => router.push('/transactions')}
        isSubmitting={createTransaction.isPending}
      />

      <PossibleDuplicateDialog
        duplicate={pendingDuplicate?.duplicateOf ?? null}
        isSaving={createTransaction.isPending}
        onCancel={() => setPendingDuplicate(null)}
        onConfirm={() => pendingDuplicate && void save(pendingDuplicate.payload, true)}
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
