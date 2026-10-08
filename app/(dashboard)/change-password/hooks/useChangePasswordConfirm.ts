'use client';

import { useMutation } from '@tanstack/react-query';
import { changePasswordService } from '../services/change-password.service';
import type { ConfirmChangePasswordPayload } from '../types';

export function useChangePasswordConfirm() {
  return useMutation({
    mutationFn: (payload: ConfirmChangePasswordPayload) => changePasswordService.confirm(payload),
  });
}
