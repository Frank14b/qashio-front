'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

const QUICK_ACTIONS = [
  {
    href: '/accounts/new',
    title: 'Add wallet',
    description: 'Create a cash, bank, or card account.',
  },
  {
    href: '/accounts',
    title: 'View accounts',
    description: 'See every wallet and which one is default.',
  },
  {
    href: '/transactions/new',
    title: 'New transaction',
    description: 'Record income or spending.',
  },
  {
    href: '/change-password',
    title: 'Change password',
    description: 'Update your sign-in credentials.',
  },
] as const;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '2.4rem' },
            letterSpacing: '-0.02em',
          }}
        >
          {user ? `Welcome, ${user.displayName}` : 'Dashboard'}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
          Manage wallets, track cash flow, and jump into the actions you use most.
        </Typography>
      </Box>

      <Box>
        <Typography
          component="h2"
          sx={{
            m: 0,
            mb: 2,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.35rem',
          }}
        >
          Quick actions
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          {QUICK_ACTIONS.map((action) => (
            <Box
              key={action.href}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{action.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {action.description}
              </Typography>
              <Button
                component={Link}
                href={action.href}
                variant="contained"
                sx={{ alignSelf: 'flex-start' }}
              >
                Open
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}
