'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { formatMoney } from '@/lib/format/money';
import { useDeleteBudget } from '../hooks/useBudgetMutations';
import { useBudgets } from '../hooks/useBudgets';
import type { Budget, BudgetStatus } from '../types';

const STATUS: Record<BudgetStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  ok: { label: 'On track', color: 'success' },
  warning: { label: 'Almost there', color: 'warning' },
  exceeded: { label: 'Over budget', color: 'error' },
};

const PERIOD_LABEL = { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };

function BudgetCard({ budget }: { budget: Budget }) {
  const deleteBudget = useDeleteBudget();
  const [error, setError] = useState<string | null>(null);
  const status = STATUS[budget.usage.status];
  const overBy = budget.usage.remaining.startsWith('-');

  const handleDelete = async () => {
    if (!window.confirm(`Delete the ${budget.category.name} budget?`)) {
      return;
    }
    setError(null);
    try {
      await deleteBudget.mutateAsync(budget.id);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, 'Unable to delete budget'));
    }
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{budget.category.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {PERIOD_LABEL[budget.period]} · {budget.account.name} ({budget.currencyCode})
          </Typography>
        </Box>
        <Chip size="small" variant="outlined" label={status.label} color={status.color} />
      </Stack>

      <LinearProgress
        variant="determinate"
        value={Math.min(budget.usage.percentUsed, 100)}
        color={status.color}
        sx={{ my: 2, height: 8, borderRadius: 4 }}
        aria-label={`${budget.usage.percentUsed}% of budget used`}
      />

      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Typography sx={{ fontVariantNumeric: 'tabular-nums' }}>
          <strong>{formatMoney(budget.usage.spent, budget.currencyCode)}</strong> of{' '}
          {formatMoney(budget.amount, budget.currencyCode)} ({budget.usage.percentUsed}%)
        </Typography>
        <Typography
          sx={{ fontVariantNumeric: 'tabular-nums', color: overBy ? 'error.main' : 'text.secondary' }}
        >
          {overBy
            ? `Over by ${formatMoney(budget.usage.remaining.slice(1), budget.currencyCode)}`
            : `${formatMoney(budget.usage.remaining, budget.currencyCode)} left`}
        </Typography>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          size="small"
          color="error"
          onClick={() => void handleDelete()}
          disabled={deleteBudget.isPending}
        >
          {deleteBudget.isPending ? 'Deleting…' : 'Delete'}
        </Button>
        <Button size="small" variant="outlined" component={Link} href={`/budgets/${budget.id}/edit`}>
          Edit
        </Button>
      </Stack>
    </Box>
  );
}

export function BudgetsList() {
  const budgets = useBudgets();

  if (budgets.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (budgets.isError) {
    return <Alert severity="error">{getErrorMessage(budgets.error, 'Unable to load budgets')}</Alert>;
  }

  if (!budgets.data?.length) {
    return (
      <Box
        sx={{
          p: 4,
          borderRadius: 1.5,
          border: '1px dashed',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1 }}>No budgets yet</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Set a spending limit for a category and get alerted at 80% and 100%.
        </Typography>
        <Button component={Link} href="/budgets/new" variant="contained">
          Add budget
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {budgets.data.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </Box>
  );
}
