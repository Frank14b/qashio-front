'use client';

import { endOfDay, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { TRANSACTIONS_PAGE_SIZE, useTransactionStore } from '../stores/transactionStore';
import type { TransactionListParams } from '../types';

export function useTransactionFilters() {
  const filters = useTransactionStore((state) => state.filters);
  const page = useTransactionStore((state) => state.page);
  const sort = useTransactionStore((state) => state.sort);
  const setDateRange = useTransactionStore((state) => state.setDateRange);
  const setSearchTerm = useTransactionStore((state) => state.setSearchTerm);
  const setFilter = useTransactionStore((state) => state.setFilter);
  const resetFilters = useTransactionStore((state) => state.resetFilters);
  const setPage = useTransactionStore((state) => state.setPage);
  const setSort = useTransactionStore((state) => state.setSort);

  /** Store state → API query params (whole days, 1-based page, empty filters dropped). */
  const params = useMemo<TransactionListParams>(() => {
    const { startDate, endDate } = filters.dateRange;
    return {
      page: page + 1,
      limit: TRANSACTIONS_PAGE_SIZE,
      sortBy: sort.field,
      sortOrder: sort.order,
      search: filters.searchTerm.trim() || undefined,
      type: filters.type || undefined,
      accountId: filters.accountId || undefined,
      categoryId: filters.categoryId || undefined,
      from: startDate ? startOfDay(startDate).toISOString() : undefined,
      to: endDate ? endOfDay(endDate).toISOString() : undefined,
    };
  }, [filters, page, sort]);

  const hasActiveFilters =
    Boolean(filters.searchTerm.trim()) ||
    Boolean(filters.type || filters.accountId || filters.categoryId) ||
    Boolean(filters.dateRange.startDate || filters.dateRange.endDate);

  return {
    filters,
    page,
    sort,
    params,
    hasActiveFilters,
    setDateRange,
    setSearchTerm,
    setFilter,
    resetFilters,
    setPage,
    setSort,
  };
}
