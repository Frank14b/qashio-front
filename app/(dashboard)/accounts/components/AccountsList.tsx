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
import { getErrorMessage } from '@/lib/api/get-error-message';
import { useAccounts } from '../hooks/useAccounts';

export function AccountsList() {
  const accounts = useAccounts();

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
          borderRadius: 3,
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

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'auto',
      }}
    >
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((account) => (
            <TableRow key={account.id} hover>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight={600}>{account.name}</Typography>
                  {account.isDefault ? <Chip size="small" label="Default" color="primary" /> : null}
                </Stack>
              </TableCell>
              <TableCell>{account.currencyCode}</TableCell>
              <TableCell>{account.archivedAt ? 'Archived' : 'Active'}</TableCell>
              <TableCell>
                {new Date(account.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
