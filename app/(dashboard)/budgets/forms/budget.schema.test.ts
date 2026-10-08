import {
  budgetFormDefaults,
  budgetFormSchema,
  toCreateBudgetsPayload,
  toUpdateBudgetPayload,
} from './budget.schema';

const valid = {
  ...budgetFormDefaults,
  accountId: 'acc-1',
  categoryIds: ['cat-food', 'cat-transport'],
  amount: '500.00',
};

describe('budgetFormSchema', () => {
  it.each([
    ['', 'Limit is required'],
    ['0.00', 'Limit must be greater than 0'],
    ['-10', 'Enter a valid amount, e.g. 500.00'],
    ['1.23456', 'Enter a valid amount, e.g. 500.00'],
  ])('rejects limit %p', (amount, message) => {
    const result = budgetFormSchema.safeParse({ ...valid, amount });
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('requires a wallet and at least one category', () => {
    const result = budgetFormSchema.safeParse({ ...valid, accountId: '', categoryIds: [] });
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Choose a wallet',
      'Choose at least one category',
    ]);
  });

  it('accepts a positive decimal limit', () => {
    expect(budgetFormSchema.safeParse(valid).success).toBe(true);
  });
});

describe('budget payload builders', () => {
  it('sends every selected category with the wallet and keeps the amount a string', () => {
    expect(toCreateBudgetsPayload(valid)).toEqual({
      accountId: 'acc-1',
      categoryIds: ['cat-food', 'cat-transport'],
      amount: '500.00',
      period: 'monthly',
    });
  });

  it('only sends the editable fields on update', () => {
    expect(toUpdateBudgetPayload({ ...valid, period: 'weekly' })).toEqual({
      amount: '500.00',
      period: 'weekly',
    });
  });
});
