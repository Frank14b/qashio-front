'use client';

import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: ({ signal }) => transactionsService.getAll({ signal }),
  });
}