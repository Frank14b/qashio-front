import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type {
  CreateTransactionOptions,
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

  create: (
    payload: CreateTransactionPayload,
    { idempotencyKey, confirmDuplicate }: CreateTransactionOptions,
    config?: ApiRequestConfig,
  ) =>
    api.post<Transaction>(
      '/transactions',
      confirmDuplicate ? { ...payload, confirmDuplicate } : payload,
      { ...config, headers: { ...config?.headers, 'Idempotency-Key': idempotencyKey } },
    ),

  update: (id: string, payload: UpdateTransactionPayload, config?: ApiRequestConfig) =>
    api.put<Transaction>(`/transactions/${id}`, payload, config),

  remove: (id: string, config?: ApiRequestConfig) =>
    api.delete<void>(`/transactions/${id}`, config),
};
