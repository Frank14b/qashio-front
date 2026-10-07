export interface Transaction {
  id: string;
  date: string;
  reference: string;
  counterparty: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  category: string;
  narration: string;
  type?: 'income' | 'expense';
}

export type { TransactionFormValues as TransactionFormData } from './forms/transaction.schema';

export interface TransactionFilters {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  searchTerm: string;
}

export interface CreateTransactionPayload {
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  narration?: string;
}
