'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';
import type { CreateAccountPayload } from '../types';

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => accountsService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
