import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { Category, CreateCategoryPayload } from '../types';

export const categoriesService = {
  list: (config?: ApiRequestConfig) => api.get<Category[]>('/categories', config),

  create: (payload: CreateCategoryPayload, config?: ApiRequestConfig) =>
    api.post<Category>('/categories', payload, config),
};
