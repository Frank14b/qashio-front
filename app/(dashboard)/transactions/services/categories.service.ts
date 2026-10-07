import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { Category } from '../types';

export const categoriesService = {
  list: (config?: ApiRequestConfig) => api.get<Category[]>('/categories', config),
};
