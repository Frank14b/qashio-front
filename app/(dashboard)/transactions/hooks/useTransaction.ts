'use client';

import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: ({ signal }) => transactionsService.getById(id, { signal }),
    enabled: Boolean(id),
  });
}
