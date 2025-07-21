export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  ILS = "ILS",
}

export function getCurrencySymbol(currency?: Currency): string {
  switch (currency) {
    case Currency.EUR:
      return "€";
    case Currency.GBP:
      return "£";
    case Currency.ILS:
      return "₪";
    case Currency.USD:
    default:
      return "$";
  }
}

export function formatCurrencyAmount(
  amount: number,
  currency?: Currency
): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString()}`;
}
