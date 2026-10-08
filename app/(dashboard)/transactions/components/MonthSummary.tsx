'use client';

import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { formatMoney } from '@/lib/format/money';
import { useTransactionSummary } from '../hooks/useTransactionSummary';

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', fontVariantNumeric: 'tabular-nums', color }}>
        {value}
      </Typography>
    </Box>
  );
}

/** Completed income / expense / net for the current calendar month, per currency. */
export function MonthSummary() {
  const range = useMemo(() => {
    const now = new Date();
    return {
      from: startOfMonth(now).toISOString(),
      to: endOfMonth(now).toISOString(),
      label: format(now, 'MMMM yyyy'),
    };
  }, []);
  const summary = useTransactionSummary({ from: range.from, to: range.to });

  return (
    <Box>
      <Typography
        component="h2"
        sx={{ m: 0, mb: 2, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.35rem' }}
      >
        {range.label}
      </Typography>

      {summary.isLoading ? (
        <Skeleton variant="rounded" height={96} />
      ) : summary.isError ? (
        <Alert severity="error">{getErrorMessage(summary.error, 'Unable to load summary')}</Alert>
      ) : !summary.data?.length ? (
        <Typography color="text.secondary">No completed transactions this month yet.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {summary.data.map((row) => (
            <Box
              key={row.currencyCode}
              sx={{
                p: 2.5,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
              <Stat
                label="Money in"
                value={formatMoney(row.income, row.currencyCode)}
                color="success.main"
              />
              <Stat
                label="Money out"
                value={formatMoney(row.expense, row.currencyCode)}
                color="error.main"
              />
              <Stat
                label={`Net · ${row.count} transaction${row.count === 1 ? '' : 's'}`}
                value={formatMoney(row.net, row.currencyCode, { signDisplay: 'exceptZero' })}
                color={row.net.startsWith('-') ? 'error.main' : 'text.primary'}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
