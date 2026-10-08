'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categories.service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => categoriesService.list({ signal }),
    staleTime: 5 * 60 * 1000,
  });
}
