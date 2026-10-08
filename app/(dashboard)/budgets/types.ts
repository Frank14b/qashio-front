export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';
/** `warning` ≥ 80% of the limit, `exceeded` ≥ 100% */
export type BudgetStatus = 'ok' | 'warning' | 'exceeded';

export interface Budget {
  id: string;
  category: { id: string; name: string };
  account: { id: string; name: string };
  /** The wallet's currency */
  currencyCode: string;
  /** Decimal string formatted to the currency scale */
  amount: string;
  period: BudgetPeriod;
  usage: {
    periodStart: string;
    /** Exclusive */
    periodEnd: string;
    spent: string;
    /** Negative when over budget */
    remaining: string;
    percentUsed: number;
    status: BudgetStatus;
  };
  createdAt: string;
  updatedAt: string;
}

/** One budget is created per category, all on the same wallet with the same limit and period. */
export interface CreateBudgetsPayload {
  accountId: string;
  categoryIds: string[];
  amount: string;
  period: BudgetPeriod;
}

/** Scope (category, wallet) is fixed after creation. */
export type UpdateBudgetPayload = Partial<Pick<CreateBudgetsPayload, 'amount' | 'period'>>;
