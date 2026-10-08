'use client';

import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMarkNotificationsRead, useNotifications } from '../hooks/useNotifications';
import type { AppNotification } from '../types';

const BellIcon = () => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

/** Where a notification leads, based on the resource it references. */
function hrefFor({ type, data }: AppNotification): string | null {
  if (data.budgetId) return '/budgets';
  if (data.transactionId || type.startsWith('transaction.')) return '/transactions';
  if (data.accountId) return '/accounts';
  return null;
}

export function NotificationsBell() {
  const router = useRouter();
  const notifications = useNotifications();
  const markRead = useMarkNotificationsRead();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const items = notifications.data?.items ?? [];
  const unreadCount = notifications.data?.unreadCount ?? 0;

  const open = (notification: AppNotification) => {
    if (!notification.readAt) {
      markRead.mutate(notification.id);
    }
    const href = hrefFor(notification);
    setAnchor(null);
    if (href) {
      router.push(href);
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <BellIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: 'calc(100vw - 32px)' } } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Button
            size="small"
            onClick={() => markRead.mutate(undefined)}
            disabled={unreadCount === 0 || markRead.isPending}
          >
            Mark all as read
          </Button>
        </Stack>
        <Divider />

        {notifications.isError ? (
          <Typography color="error" variant="body2" sx={{ p: 2 }}>
            Unable to load notifications.
          </Typography>
        ) : items.length === 0 ? (
          <Typography color="text.secondary" variant="body2" sx={{ p: 2 }}>
            {notifications.isLoading ? 'Loading…' : "You're all caught up."}
          </Typography>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 420, overflowY: 'auto' }}>
            {items.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() => open(notification)}
                sx={{
                  alignItems: 'flex-start',
                  gap: 1.5,
                  py: 1.25,
                  bgcolor: notification.readAt ? 'transparent' : 'action.hover',
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    mt: 0.75,
                    width: 8,
                    height: 8,
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: notification.readAt
                      ? 'transparent'
                      : notification.type === 'budget.threshold_reached'
                        ? 'error.main'
                        : 'primary.main',
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: notification.readAt ? 500 : 700 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
