'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { BudgetsList } from './components/BudgetsList';

export default function BudgetsPage() {
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
            Budgets
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Spending limits per category. You&apos;re notified at 80% and when you go over.
          </Typography>
        </Box>
        <Button component={Link} href="/budgets/new" variant="contained">
          Add budget
        </Button>
      </Box>
      <BudgetsList />
    </Stack>
  );
}
