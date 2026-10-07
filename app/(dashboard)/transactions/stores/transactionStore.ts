'use client';

import { create } from 'zustand';
import type { SortOrder, TransactionFilters, TransactionSortField } from '../types';

export const TRANSACTIONS_PAGE_SIZE = 10;

const initialFilters: TransactionFilters = {
  dateRange: {
    startDate: null,
    endDate: null,
  },
  searchTerm: '',
  type: '',
  accountId: '',
  categoryId: '',
};

const initialSort: { field: TransactionSortField; order: SortOrder } = {
  field: 'occurredAt',
  order: 'DESC',
};

interface TransactionState {
  filters: TransactionFilters;
  /** 0-based (DataGrid convention); the API is 1-based. */
  page: number;
  sort: { field: TransactionSortField; order: SortOrder };
  setDateRange: (startDate: Date | null, endDate: Date | null) => void;
  setSearchTerm: (term: string) => void;
  setFilter: <K extends 'type' | 'accountId' | 'categoryId'>(
    key: K,
    value: TransactionFilters[K],
  ) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setSort: (sort: { field: TransactionSortField; order: SortOrder } | null) => void;
}

// Any filter change jumps back to the first page so results are never "missing".
export const useTransactionStore = create<TransactionState>((set) => ({
  filters: initialFilters,
  page: 0,
  sort: initialSort,

  setDateRange: (startDate, endDate) =>
    set((state) => ({
      filters: {
        ...state.filters,
        dateRange: { startDate, endDate },
      },
      page: 0,
    })),

  setSearchTerm: (searchTerm) =>
    set((state) => ({
      filters: {
        ...state.filters,
        searchTerm,
      },
      page: 0,
    })),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 0,
    })),

  resetFilters: () => set({ filters: initialFilters, page: 0 }),

  setPage: (page) => set({ page }),

  setSort: (sort) => set({ sort: sort ?? initialSort, page: 0 }),
}));
