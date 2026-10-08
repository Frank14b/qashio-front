import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { Currency } from '../types';

export const currenciesService = {
  list: (config?: ApiRequestConfig) => api.get<Currency[]>('/currencies', config),
};
