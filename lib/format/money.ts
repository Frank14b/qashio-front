type FormatMoneyOptions = {
  /** `always` prefixes + for positive values (e.g. income rows). */
  signDisplay?: Intl.NumberFormatOptions['signDisplay'];
};

/**
 * Formats an API decimal string (e.g. `"1250.00"`) as currency.
 * `Intl.NumberFormat#format` accepts numeric strings exactly (no float rounding)
 * and applies the currency's own minor units (USD → 2, XAF → 0).
 */
export function formatMoney(
  amount: string,
  currencyCode: string,
  { signDisplay = 'auto' }: FormatMoneyOptions = {},
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'code',
      signDisplay,
    }).format(amount as Intl.StringNumericLiteral);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}
