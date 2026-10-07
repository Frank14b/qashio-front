/** `income` = money in (+), `expense` = money out (−). Amounts are always positive. */
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type CategoryKind = 'income' | 'expense' | 'both';

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  direction: 'in' | 'out';
  /** Positive decimal string formatted to the currency scale, e.g. `"42.50"` */
  amount: string;
  /** Amount with its balance effect, e.g. `"-42.50"` for an expense */
  signedAmount: string;
  currencyCode: string;
  status: TransactionStatus;
  counterparty: string | null;
  narration: string | null;
  occurredAt: string;
  account: { id: string; name: string; currencyCode: string };
  category: { id: string; name: string; kind: CategoryKind };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionList {
  items: Transaction[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export type TransactionSortField = 'occurredAt' | 'amount' | 'createdAt' | 'reference' | 'counterparty';
export type SortOrder = 'ASC' | 'DESC';

export interface TransactionListParams {
  /** 1-based */
  page: number;
  limit: number;
  sortBy?: TransactionSortField;
  sortOrder?: SortOrder;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  /** ISO date-time, inclusive */
  from?: string;
  /** ISO date-time, inclusive */
  to?: string;
  search?: string;
}

export interface TransactionSummaryParams {
  accountId?: string;
  from?: string;
  to?: string;
}

export interface TransactionSummary {
  currencyCode: string;
  income: string;
  expense: string;
  net: string;
  count: number;
}

export interface CreateTransactionPayload {
  /** Omit to use the default wallet */
  accountId?: string;
  categoryId: string;
  type: TransactionType;
  /** Decimal string, e.g. `"42.50"` */
  amount: string;
  counterparty?: string | null;
  narration?: string | null;
  occurredAt: string;
}

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface TransactionFilters {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  searchTerm: string;
  type: TransactionType | '';
  accountId: string;
  categoryId: string;
}

export type { TransactionFormValues as TransactionFormData } from './forms/transaction.schema';
