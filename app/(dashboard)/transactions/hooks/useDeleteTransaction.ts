'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import { invalidateTransactionQueries } from './invalidate-transaction-queries';

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.remove(id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: ['transaction', id] });
      invalidateTransactionQueries(queryClient);
    },
  });
}
