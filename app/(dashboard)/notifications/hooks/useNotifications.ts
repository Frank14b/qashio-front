'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';

// Notifications are produced asynchronously by server-side event listeners,
// so poll instead of relying only on invalidation after the user's own writes.
const POLL_INTERVAL_MS = 30_000;

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: ({ signal }) => notificationsService.list({ signal }),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    /** Pass an id to mark one notification, or nothing to mark all. */
    mutationFn: (id?: string) =>
      id ? notificationsService.markRead(id) : notificationsService.markAllRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
