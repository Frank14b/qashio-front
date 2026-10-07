'use client';

import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import type { TransactionSummaryParams } from '../types';

export function useTransactionSummary(params: TransactionSummaryParams = {}) {
  return useQuery({
    queryKey: ['transaction-summary', params],
    queryFn: ({ signal }) => transactionsService.summary(params, { signal }),
  });
}
