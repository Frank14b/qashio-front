'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import type { UpdateTransactionPayload } from '../types';
import { invalidateTransactionQueries } from './invalidate-transaction-queries';

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      transactionsService.update(id, payload),
    onSuccess: (_transaction, variables) => invalidateTransactionQueries(queryClient, variables.id),
  });
}
