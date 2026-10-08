'use client';

import { useQuery } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: ({ signal }) => accountsService.getOne(id, { signal }),
    enabled: Boolean(id),
  });
}
