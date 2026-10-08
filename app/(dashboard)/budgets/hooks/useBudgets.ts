'use client';

import { useQuery } from '@tanstack/react-query';
import { budgetsService } from '../services/budgets.service';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: ({ signal }) => budgetsService.list({ signal }),
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: ({ signal }) => budgetsService.getOne(id, { signal }),
    enabled: Boolean(id),
  });
}
