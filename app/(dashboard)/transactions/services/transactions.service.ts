import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { CreateTransactionPayload, Transaction } from '../types';

export const transactionsService = {
  getAll: (config?: ApiRequestConfig) => api.get<Transaction[]>('/transactions', config),

  getById: (id: string, config?: ApiRequestConfig) =>
    api.get<Transaction>(`/transactions/${id}`, config),

  create: (payload: CreateTransactionPayload, config?: ApiRequestConfig) =>
    api.post<Transaction>('/transactions', payload, config),

  update: (id: string, payload: Partial<CreateTransactionPayload>, config?: ApiRequestConfig) =>
    api.put<Transaction>(`/transactions/${id}`, payload, config),

  remove: (id: string, config?: ApiRequestConfig) =>
    api.delete<void>(`/transactions/${id}`, config),
};
