import { toTransactionPayload } from './TransactionForm';
import { transactionFormDefaults, transactionFormSchema } from './transaction.schema';

const valid = {
  ...transactionFormDefaults,
  accountId: 'acc-1',
  categoryId: 'cat-1',
  amount: '42.50',
  date: new Date('2026-10-07T00:00:00.000Z'),
};

describe('transactionFormSchema', () => {
  it('accepts a positive decimal amount', () => {
    expect(transactionFormSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['', 'Amount is required'],
    ['0', 'Amount must be greater than 0'],
    ['-5', 'Enter a valid amount, e.g. 42.50'],
    ['1.23456', 'Enter a valid amount, e.g. 42.50'],
    ['abc', 'Enter a valid amount, e.g. 42.50'],
  ])('rejects amount %p', (amount, message) => {
    const result = transactionFormSchema.safeParse({ ...valid, amount });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('requires a wallet and a category', () => {
    const result = transactionFormSchema.safeParse({ ...valid, accountId: '', categoryId: '' });
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['accountId', 'categoryId']);
  });
});

describe('toTransactionPayload', () => {
  it('keeps the amount as a string and turns blank optional text into null', () => {
    const payload = toTransactionPayload({ ...valid, type: 'income', counterparty: '', narration: '' });

    expect(payload).toEqual({
      type: 'income',
      accountId: 'acc-1',
      categoryId: 'cat-1',
      amount: '42.50',
      occurredAt: '2026-10-07T00:00:00.000Z',
      counterparty: null,
      narration: null,
    });
  });
});
