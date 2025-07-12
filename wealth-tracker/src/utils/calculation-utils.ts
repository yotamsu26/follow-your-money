import { MoneyLocationData } from "../pages/dashboard";

export function calculateTotalWealth(moneyLocations: MoneyLocationData[]) {
  return moneyLocations.reduce((total, location) => {
    // Convert all currencies to USD for simplicity (in a real app, use exchange rates)
    const exchangeRates = { USD: 1, EUR: 1.1, GBP: 1.25, ILS: 0.27 };
    const rate =
      exchangeRates[location.currency as keyof typeof exchangeRates] || 1;
    return total + location.amount * rate;
  }, 0);
}

export function calculateAssetAllocation(moneyLocations: MoneyLocationData[]) {
  const allocation = moneyLocations.reduce((acc, location) => {
    const exchangeRates = { USD: 1, EUR: 1.1, GBP: 1.25, ILS: 0.27 };
    const rate =
      exchangeRates[location.currency as keyof typeof exchangeRates] || 1;
    const usdAmount = location.amount * rate;

    acc[location.account_type] = (acc[location.account_type] || 0) + usdAmount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(allocation).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return Object.entries(allocation).map(([type, amount]) => ({
    type,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
  }));
}
