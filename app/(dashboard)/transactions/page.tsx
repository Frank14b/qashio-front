'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { ContentCard } from '@/app/components/ui';
import { TransactionDetailsDrawer } from './components/TransactionDetailsDrawer';
import { TransactionFiltersBar } from './components/TransactionFiltersBar';
import { TransactionsTable } from './components/TransactionsTable';
import type { Transaction } from './types';

export default function TransactionsPage() {
  const [selected, setSelected] = useState<Transaction | null>(null);

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
            Transactions
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Money in and out of your wallets. Click a row for details.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            href="/transactions/new?type=income"
            variant="outlined"
            color="success"
          >
            + Add income
          </Button>
          <Button component={Link} href="/transactions/new?type=expense" variant="contained">
            − Add expense
          </Button>
        </Stack>
      </Box>

      <ContentCard>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TransactionFiltersBar />
        </Box>
        <TransactionsTable onRowClick={setSelected} />
      </ContentCard>
      <TransactionDetailsDrawer transaction={selected} onClose={() => setSelected(null)} />
    </Stack>
  );
}
