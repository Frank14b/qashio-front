export type Account = {
  id: string;
  name: string;
  currencyCode: string;
  /** Decimal string formatted to the currency scale, e.g. `"1500.00"` */
  openingBalance: string;
  /** openingBalance + completed income − completed expense (derived by the API) */
  balance: string;
  isDefault: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountPayload = {
  name: string;
  currencyCode: string;
  isDefault?: boolean;
  /** Decimal string, may be negative (e.g. a credit card) */
  openingBalance?: string;
};

export type UpdateAccountPayload = {
  name?: string;
  isDefault?: boolean;
  archive?: boolean;
  openingBalance?: string;
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
};
