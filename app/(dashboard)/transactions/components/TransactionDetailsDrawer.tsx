'use client';

import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { useDeleteTransaction } from '../hooks/useDeleteTransaction';
import type { Transaction } from '../types';
import { TransactionAmount, TransactionStatusChip } from './TransactionAmount';

type TransactionDetailsDrawerProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 2, py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ minWidth: 0, wordBreak: 'break-word' }}>{children}</Box>
    </Box>
  );
}

export function TransactionDetailsDrawer({ transaction, onClose }: TransactionDetailsDrawerProps) {
  const deleteTransaction = useDeleteTransaction();
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleDelete = async (target: Transaction) => {
    const confirmed = window.confirm(`Delete ${target.reference}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    setError(null);
    try {
      await deleteTransaction.mutateAsync(target.id);
      handleClose();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, 'Unable to delete transaction'));
    }
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(transaction)}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      {transaction ? (
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                {transaction.type === 'income' ? 'Income · money in' : 'Expense · money out'}
              </Typography>
              <TransactionAmount
                transaction={transaction}
                sx={{ display: 'block', fontSize: '1.75rem', lineHeight: 1.2 }}
              />
            </Box>
            <IconButton onClick={handleClose} aria-label="Close details">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </IconButton>
          </Stack>
          <Divider />

          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}
            <DetailRow label="Reference">
              <Typography sx={{ fontFamily: 'monospace' }}>{transaction.reference}</Typography>
            </DetailRow>
            <DetailRow label="Status">
              <TransactionStatusChip status={transaction.status} />
            </DetailRow>
            <DetailRow label="Date">
              <Typography>{format(new Date(transaction.occurredAt), 'EEEE, dd MMM yyyy')}</Typography>
            </DetailRow>
            <DetailRow label={transaction.type === 'income' ? 'Received from' : 'Paid to'}>
              <Typography>{transaction.counterparty ?? '—'}</Typography>
            </DetailRow>
            <DetailRow label="Category">
              <Typography>{transaction.category.name}</Typography>
            </DetailRow>
            <DetailRow label="Wallet">
              <Typography>
                {transaction.account.name} · {transaction.account.currencyCode}
              </Typography>
            </DetailRow>
            <DetailRow label="Narration">
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{transaction.narration ?? '—'}</Typography>
            </DetailRow>
            <DetailRow label="Recorded">
              <Typography variant="body2">
                {format(new Date(transaction.createdAt), 'dd MMM yyyy, HH:mm')}
              </Typography>
            </DetailRow>
          </Box>

          <Divider />
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ p: 2.5 }}>
            <Button
              color="error"
              variant="text"
              onClick={() => void handleDelete(transaction)}
              disabled={deleteTransaction.isPending}
            >
              {deleteTransaction.isPending ? 'Deleting…' : 'Delete'}
            </Button>
            <Button
              component={Link}
              href={`/transactions/${transaction.id}/edit`}
              variant="contained"
              disabled={deleteTransaction.isPending}
            >
              Edit
            </Button>
          </Stack>
        </Stack>
      ) : null}
    </Drawer>
  );
}
