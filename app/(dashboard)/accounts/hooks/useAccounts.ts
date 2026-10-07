'use client';

import { useQuery } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';

export function useAccounts(includeArchived = false) {
  return useQuery({
    queryKey: ['accounts', { includeArchived }],
    queryFn: ({ signal }) => accountsService.list(includeArchived, { signal }),
  });
}
