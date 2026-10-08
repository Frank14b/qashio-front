import { formatMoney } from './money';

// Output follows the runtime locale (separators differ), so compare digits only.
const digits = (value: string) => value.replace(/\D/g, '');

describe('formatMoney', () => {
  it('uses the currency minor units without float rounding', () => {
    expect(digits(formatMoney('1250.5', 'USD'))).toBe('125050');
    expect(digits(formatMoney('1500', 'XAF'))).toBe('1500');
    // Beyond Number precision: a float would round this.
    expect(digits(formatMoney('12345678901234.99', 'USD'))).toBe('1234567890123499');
  });

  it('shows the sign for signed amounts when asked', () => {
    expect(formatMoney('-42.50', 'USD', { signDisplay: 'exceptZero' })).toMatch(/^-/);
    expect(formatMoney('42.50', 'USD', { signDisplay: 'exceptZero' })).toMatch(/^\+/);
  });

  it('includes the currency code', () => {
    expect(formatMoney('10', 'EUR')).toContain('EUR');
  });

  it('falls back to plain text for unknown currency codes', () => {
    expect(formatMoney('10', 'NOT-A-CODE')).toBe('10 NOT-A-CODE');
  });
});
