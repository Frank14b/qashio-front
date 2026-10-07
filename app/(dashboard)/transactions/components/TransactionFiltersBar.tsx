'use client';

import { Box, Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useMemo, useState } from 'react';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import type { TransactionType } from '../types';

const SEARCH_DEBOUNCE_MS = 350;

export function TransactionFiltersBar() {
  const { filters, hasActiveFilters, setDateRange, setSearchTerm, setFilter, resetFilters } =
    useTransactionFilters();
  const accounts = useAccounts();
  const categories = useCategories();

  // Local input state so typing stays snappy; the store (→ API query) is debounced.
  const [search, setSearch] = useState(filters.searchTerm);
  const debouncedSetSearch = useMemo(() => debounce(setSearchTerm, SEARCH_DEBOUNCE_MS), [setSearchTerm]);
  useEffect(() => () => debouncedSetSearch.clear(), [debouncedSetSearch]);
  useEffect(() => setSearch(filters.searchTerm), [filters.searchTerm]);

  const categoryOptions = (categories.data ?? []).filter(
    (category) => !filters.type || category.kind === 'both' || category.kind === filters.type,
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'minmax(220px, 2fr) repeat(5, minmax(0, 1fr)) auto',
        },
        alignItems: 'center',
      }}
    >
      <TextField
        size="small"
        placeholder="Search transactions"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          debouncedSetSearch(event.target.value);
        }}
        slotProps={{
          // aria-label must sit on the <input>, not the TextField wrapper.
          htmlInput: { 'aria-label': 'Search reference, counterparty or narration' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </InputAdornment>
            ),
          },
        }}
      />
      <DatePicker
        label="From"
        value={filters.dateRange.startDate}
        onChange={(value) => setDateRange(value ?? null, filters.dateRange.endDate)}
        maxDate={filters.dateRange.endDate ?? undefined}
        slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
      />
      <DatePicker
        label="To"
        value={filters.dateRange.endDate}
        onChange={(value) => setDateRange(filters.dateRange.startDate, value ?? null)}
        minDate={filters.dateRange.startDate ?? undefined}
        slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
      />
      <TextField
        select
        size="small"
        label="Type"
        value={filters.type}
        onChange={(event) => setFilter('type', event.target.value as TransactionType | '')}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="income">Income (in)</MenuItem>
        <MenuItem value="expense">Expense (out)</MenuItem>
      </TextField>
      <TextField
        select
        size="small"
        label="Wallet"
        value={filters.accountId}
        onChange={(event) => setFilter('accountId', event.target.value)}
      >
        <MenuItem value="">All wallets</MenuItem>
        {(accounts.data ?? []).map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="Category"
        value={categoryOptions.some((c) => c.id === filters.categoryId) ? filters.categoryId : ''}
        onChange={(event) => setFilter('categoryId', event.target.value)}
      >
        <MenuItem value="">All categories</MenuItem>
        {categoryOptions.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="text"
        onClick={() => {
          debouncedSetSearch.clear();
          resetFilters();
        }}
        disabled={!hasActiveFilters}
      >
        Reset
      </Button>
    </Box>
  );
}
