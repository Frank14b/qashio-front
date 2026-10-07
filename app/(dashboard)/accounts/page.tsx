'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { AccountsList } from './components/AccountsList';

export default function AccountsPage() {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.25rem' },
            }}
          >
            Accounts
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Your wallets and how money is organized.
          </Typography>
        </Box>
        <Button component={Link} href="/accounts/new" variant="contained">
          Add wallet
        </Button>
      </Box>
      <AccountsList />
    </Stack>
  );
}
