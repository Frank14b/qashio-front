'use client';

import { useMutation } from '@tanstack/react-query';
import { changePasswordService } from '../services/change-password.service';
import type { ChangePasswordRequestPayload } from '../types';

export function useChangePasswordRequest() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequestPayload) => changePasswordService.request(payload),
  });
}
