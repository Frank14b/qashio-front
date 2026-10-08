'use client';

import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { budgetsService } from '../services/budgets.service';
import type { CreateBudgetsPayload, UpdateBudgetPayload } from '../types';

const refreshBudgets = (queryClient: QueryClient) =>
  void queryClient.invalidateQueries({ queryKey: ['budgets'] });

export function useCreateBudgets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudgetsPayload) => budgetsService.create(payload),
    onSuccess: () => refreshBudgets(queryClient),
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBudgetPayload }) =>
      budgetsService.update(id, payload),
    onSuccess: () => refreshBudgets(queryClient),
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetsService.remove(id),
    onSuccess: () => refreshBudgets(queryClient),
  });
}
