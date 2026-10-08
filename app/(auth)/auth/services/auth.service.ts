import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type {
  AuthTokensResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  MessageResponse,
  RefreshPayload,
  RegisterPayload,
  RegisterPendingResponse,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../types';

export const authService = {
  register: (payload: RegisterPayload, config?: ApiRequestConfig) =>
    api.post<RegisterPendingResponse>('/auth/register', payload, config),

  verifyEmail: (payload: VerifyEmailPayload, config?: ApiRequestConfig) =>
    api.post<AuthTokensResponse>('/auth/verify-email', payload, config),

  login: (payload: LoginPayload, config?: ApiRequestConfig) =>
    api.post<AuthTokensResponse>('/auth/login', payload, config),

  refresh: (payload: RefreshPayload, config?: ApiRequestConfig) =>
    api.post<AuthTokensResponse>('/auth/refresh', payload, config),

  logout: (payload: RefreshPayload, config?: ApiRequestConfig) =>
    api.post<void>('/auth/logout', payload, config),

  forgotPassword: (payload: ForgotPasswordPayload, config?: ApiRequestConfig) =>
    api.post<ForgotPasswordResponse>('/auth/forgot-password', payload, config),

  resetPassword: (payload: ResetPasswordPayload, config?: ApiRequestConfig) =>
    api.post<MessageResponse>('/auth/reset-password', payload, config),
};
