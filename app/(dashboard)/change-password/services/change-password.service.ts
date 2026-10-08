import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type {
  ChangePasswordRequestPayload,
  ConfirmChangePasswordPayload,
  MessageResponse,
} from '../types';

export const changePasswordService = {
  request: (payload: ChangePasswordRequestPayload, config?: ApiRequestConfig) =>
    api.post<MessageResponse>('/auth/change-password/request', payload, config),

  confirm: (payload: ConfirmChangePasswordPayload, config?: ApiRequestConfig) =>
    api.post<MessageResponse>('/auth/change-password/confirm', payload, config),
};
