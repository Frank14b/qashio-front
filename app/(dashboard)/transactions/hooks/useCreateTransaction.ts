'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import type { CreateTransactionOptions, CreateTransactionPayload } from '../types';
import { invalidateTransactionQueries } from './invalidate-transaction-queries';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      ...options
    }: CreateTransactionOptions & { payload: CreateTransactionPayload }) =>
      transactionsService.create(payload, options),
    onSuccess: () => invalidateTransactionQueries(queryClient),
  });
}
