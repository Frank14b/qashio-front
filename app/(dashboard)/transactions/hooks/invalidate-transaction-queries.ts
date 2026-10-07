import type { QueryClient } from '@tanstack/react-query';

/** A transaction write changes lists, summaries and wallet balances. */
export function invalidateTransactionQueries(queryClient: QueryClient, transactionId?: string) {
  void queryClient.invalidateQueries({ queryKey: ['transactions'] });
  void queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
  void queryClient.invalidateQueries({ queryKey: ['accounts'] });
  void queryClient.invalidateQueries({ queryKey: ['account'] });
  if (transactionId) {
    void queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
  }
}
