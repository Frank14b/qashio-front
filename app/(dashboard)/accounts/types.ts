export type Account = {
  id: string;
  name: string;
  currencyCode: string;
  isDefault: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountPayload = {
  name: string;
  currencyCode: string;
  isDefault?: boolean;
};

export type UpdateAccountPayload = {
  name?: string;
  isDefault?: boolean;
  archive?: boolean;
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
};
