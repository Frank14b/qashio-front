import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { Budget, CreateBudgetsPayload, UpdateBudgetPayload } from '../types';

export const budgetsService = {
  list: (config?: ApiRequestConfig) => api.get<Budget[]>('/budgets', config),

  getOne: (id: string, config?: ApiRequestConfig) => api.get<Budget>(`/budgets/${id}`, config),

  /** Returns every budget created (one per category). */
  create: (payload: CreateBudgetsPayload, config?: ApiRequestConfig) =>
    api.post<Budget[]>('/budgets', payload, config),

  update: (id: string, payload: UpdateBudgetPayload, config?: ApiRequestConfig) =>
    api.patch<Budget>(`/budgets/${id}`, payload, config),

  remove: (id: string, config?: ApiRequestConfig) => api.delete<void>(`/budgets/${id}`, config),
};
