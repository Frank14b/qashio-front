'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';
import type { UpdateAccountPayload } from '../types';

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountPayload }) =>
      accountsService.update(id, payload),
    onSuccess: (_account, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      void queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
