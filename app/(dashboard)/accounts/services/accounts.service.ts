import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { Account, CreateAccountPayload, UpdateAccountPayload } from '../types';

export const accountsService = {
  list: (includeArchived = false, config?: ApiRequestConfig) =>
    api.get<Account[]>('/accounts', {
      ...config,
      params: { includeArchived },
    }),

  getOne: (id: string, config?: ApiRequestConfig) =>
    api.get<Account>(`/accounts/${id}`, config),

  create: (payload: CreateAccountPayload, config?: ApiRequestConfig) =>
    api.post<Account>('/accounts', payload, config),

  update: (id: string, payload: UpdateAccountPayload, config?: ApiRequestConfig) =>
    api.patch<Account>(`/accounts/${id}`, payload, config),
};
