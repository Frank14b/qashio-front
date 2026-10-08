'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { ContentCard } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { formatMoney } from '@/lib/format/money';
import { useAccounts } from '../hooks/useAccounts';
import { useUpdateAccount } from '../hooks/useUpdateAccount';

export function AccountsList() {
  const accounts = useAccounts();
  const updateAccount = useUpdateAccount();
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (accounts.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (accounts.isError) {
    return (
      <Alert severity="error">{getErrorMessage(accounts.error, 'Unable to load accounts')}</Alert>
    );
  }

  const rows = accounts.data ?? [];

  if (rows.length === 0) {
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
        <Typography sx={{ fontWeight: 600, mb: 1 }}>No wallets yet</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Create your first account to start tracking balances and transactions.
        </Typography>
        <Button component={Link} href="/accounts/new" variant="contained">
          Add wallet
        </Button>
      </Box>
    );
  }

  const handleArchive = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Archive “${name}”? It will be hidden from the active wallets list.`,
    );
    if (!confirmed) {
      return;
    }

    setActionError(null);
    setArchivingId(id);
    try {
      await updateAccount.mutateAsync({ id, payload: { archive: true } });
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to archive wallet'));
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <Stack spacing={2}>
      {actionError ? <Alert severity="error">{actionError}</Alert> : null}
      <ContentCard sx={{ overflowX: 'auto' }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((account) => {
              const busy = archivingId === account.id;
              return (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={600}>{account.name}</Typography>
                      {account.isDefault ? (
                        <Chip size="small" label="Default" color="primary" />
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell>{account.currencyCode}</TableCell>
                  <TableCell
                    align="right"
                    title={`Opening balance ${formatMoney(account.openingBalance, account.currencyCode)}`}
                    sx={{
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      color: account.balance.startsWith('-') ? 'error.main' : 'text.primary',
                    }}
                  >
                    {formatMoney(account.balance, account.currencyCode)}
                  </TableCell>
                  <TableCell>{account.archivedAt ? 'Archived' : 'Active'}</TableCell>
                  <TableCell>
                    {new Date(account.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        component={Link}
                        href={`/accounts/${account.id}/edit`}
                        size="small"
                        variant="outlined"
                        disabled={busy}
                      >
                        Edit
                      </Button>
                      {!account.archivedAt ? (
                        <Button
                          size="small"
                          color="error"
                          variant="text"
                          disabled={busy || updateAccount.isPending}
                          onClick={() => void handleArchive(account.id, account.name)}
                        >
                          {busy ? 'Archiving…' : 'Delete'}
                        </Button>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ContentCard>
    </Stack>
  );
}
