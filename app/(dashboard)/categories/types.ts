export type CategoryKind = 'income' | 'expense' | 'both';

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  kind: CategoryKind;
}
