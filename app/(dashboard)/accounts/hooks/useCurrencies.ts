'use client';

import { useQuery } from '@tanstack/react-query';
import { currenciesService } from '../services/currencies.service';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: ({ signal }) => currenciesService.list({ signal }),
    staleTime: 60 * 60 * 1000,
  });
}
