import { api, type ApiRequestConfig } from '@/lib/api/http-client';
import type { NotificationList } from '../types';

export const notificationsService = {
  list: (config?: ApiRequestConfig) =>
    api.get<NotificationList>('/notifications', { ...config, params: { limit: 20 } }),

  markRead: (id: string, config?: ApiRequestConfig) =>
    api.patch<void>(`/notifications/${id}/read`, undefined, config),

  markAllRead: (config?: ApiRequestConfig) =>
    api.post<void>('/notifications/read-all', undefined, config),
};
