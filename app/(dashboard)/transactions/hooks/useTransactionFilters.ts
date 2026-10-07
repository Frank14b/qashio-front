'use client';

import { useTransactionStore } from '../stores/transactionStore';

export function useTransactionFilters() {
  const filters = useTransactionStore((state) => state.filters);
  const setDateRange = useTransactionStore((state) => state.setDateRange);
  const setSearchTerm = useTransactionStore((state) => state.setSearchTerm);
  const resetFilters = useTransactionStore((state) => state.resetFilters);

  return {
    filters,
    setDateRange,
    setSearchTerm,
    resetFilters,
  };
}