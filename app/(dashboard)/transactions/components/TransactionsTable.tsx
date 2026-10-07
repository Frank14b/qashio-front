'use client';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridSortModel } from '@mui/x-data-grid';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMemo } from 'react';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { useTransactions } from '../hooks/useTransactions';
import { TRANSACTIONS_PAGE_SIZE } from '../stores/transactionStore';
import type { Transaction, TransactionSortField } from '../types';
import { TransactionAmount, TransactionStatusChip } from './TransactionAmount';

const SORTABLE_FIELDS: readonly TransactionSortField[] = [
  'occurredAt',
  'reference',
  'counterparty',
  'amount',
];

const columns: GridColDef<Transaction>[] = [
  {
    field: 'occurredAt',
    headerName: 'Date',
    width: 120,
    valueFormatter: (value: string) => format(new Date(value), 'dd MMM yyyy'),
  },
  { field: 'reference', headerName: 'Reference', width: 155 },
  {
    field: 'counterparty',
    headerName: 'Counterparty',
    flex: 1,
    minWidth: 120,
    valueFormatter: (value: string | null) => value ?? '—',
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 120,
    sortable: false,
    valueGetter: (_value, row) => row.category.name,
  },
  {
    field: 'account',
    headerName: 'Wallet',
    width: 110,
    sortable: false,
    valueGetter: (_value, row) => row.account.name,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 145,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => <TransactionAmount transaction={row} />,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 115,
    sortable: false,
    renderCell: ({ row }) => <TransactionStatusChip status={row.status} />,
  },
];

function NoTransactionsOverlay() {
  const { hasActiveFilters, resetFilters } = useTransactionFilters();
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ height: '100%', p: 3 }}>
      <Typography sx={{ fontWeight: 600 }}>No transactions found</Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {hasActiveFilters
          ? 'Try adjusting or resetting the filters.'
          : 'Record your first income or expense to see it here.'}
      </Typography>
      {hasActiveFilters ? (
        <Button size="small" onClick={resetFilters}>
          Reset filters
        </Button>
      ) : (
        <Button size="small" variant="contained" component={Link} href="/transactions/new?type=expense">
          Add transaction
        </Button>
      )}
    </Stack>
  );
}

type TransactionsTableProps = {
  onRowClick: (transaction: Transaction) => void;
};

/** Server-driven grid: pagination, sorting and filters all go to `GET /transactions`. */
export function TransactionsTable({ onRowClick }: TransactionsTableProps) {
  const { params, page, sort, setPage, setSort } = useTransactionFilters();
  const transactions = useTransactions(params);

  const sortModel = useMemo<GridSortModel>(
    () => [{ field: sort.field, sort: sort.order === 'ASC' ? 'asc' : 'desc' }],
    [sort],
  );

  if (transactions.isError && !transactions.data) {
    return (
      <Alert severity="error">
        {getErrorMessage(transactions.error, 'Unable to load transactions')}
      </Alert>
    );
  }

  return (
    <Stack spacing={1.5}>
      {transactions.isError ? (
        <Alert severity="warning">
          {getErrorMessage(transactions.error, 'Refreshing transactions failed; showing last results')}
        </Alert>
      ) : null}
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1.5, minHeight: 420 }}>
        <DataGrid
          rows={transactions.data?.items ?? []}
          columns={columns}
          rowCount={transactions.data?.meta.total ?? 0}
          loading={transactions.isFetching}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          disableColumnFilter
          disableRowSelectionOnClick
          pageSizeOptions={[TRANSACTIONS_PAGE_SIZE]}
          paginationModel={{ page, pageSize: TRANSACTIONS_PAGE_SIZE }}
          onPaginationModelChange={(model) => setPage(model.page)}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            const [first] = model;
            const field = first?.field as TransactionSortField | undefined;
            setSort(
              first && field && SORTABLE_FIELDS.includes(field)
                ? { field, order: first.sort === 'asc' ? 'ASC' : 'DESC' }
                : null,
            );
          }}
          onRowClick={({ row }) => onRowClick(row)}
          slots={{ noRowsOverlay: NoTransactionsOverlay }}
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            minHeight: 420,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
          }}
        />
      </Box>
    </Stack>
  );
}
