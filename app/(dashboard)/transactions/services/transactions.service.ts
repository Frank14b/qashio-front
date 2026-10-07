import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionList,
  TransactionListParams,
  TransactionSummary,
  TransactionSummaryParams,
  UpdateTransactionPayload,
} from '../types';

export const transactionsService = {
  list: (params: TransactionListParams, config?: ApiRequestConfig) =>
    api.get<TransactionList>('/transactions', { ...config, params }),

  getById: (id: string, config?: ApiRequestConfig) =>
    api.get<Transaction>(`/transactions/${id}`, config),

  summary: (params: TransactionSummaryParams, config?: ApiRequestConfig) =>
    api.get<TransactionSummary[]>('/transactions/summary', { ...config, params }),

  create: (payload: CreateTransactionPayload, config?: ApiRequestConfig) =>
    api.post<Transaction>('/transactions', payload, config),

  update: (id: string, payload: UpdateTransactionPayload, config?: ApiRequestConfig) =>
    api.put<Transaction>(`/transactions/${id}`, payload, config),

  remove: (id: string, config?: ApiRequestConfig) =>
    api.delete<void>(`/transactions/${id}`, config),
};
