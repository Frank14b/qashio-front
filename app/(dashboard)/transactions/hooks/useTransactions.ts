'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import type { TransactionListParams } from '../types';

export function useTransactions(params: TransactionListParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: ({ signal }) => transactionsService.list(params, { signal }),
    // Keep the current page visible while the next page / sort / filter loads.
    placeholderData: keepPreviousData,
  });
}
