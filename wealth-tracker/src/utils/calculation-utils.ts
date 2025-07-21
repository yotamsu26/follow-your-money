import { MoneyLocationData } from "../hooks/useDashboard";
import currencyService from "../services/currencyService";

export async function calculateTotalWealth(
  moneyLocations: MoneyLocationData[]
): Promise<number> {
  let total = 0;

  for (const location of moneyLocations) {
    const usdAmount = await currencyService.convertCurrency(
      location.amount,
      location.currency,
      "USD"
    );
    total += usdAmount;
  }

  return total;
}

export async function calculateAssetAllocation(
  moneyLocations: MoneyLocationData[]
): Promise<
  Array<{
    type: string;
    amount: number;
    percentage: number;
  }>
> {
  const allocation: Record<string, number> = {};

  for (const location of moneyLocations) {
    const usdAmount = await currencyService.convertCurrency(
      location.amount,
      location.currency,
      "USD"
    );

    allocation[location.account_type] =
      (allocation[location.account_type] || 0) + usdAmount;
  }

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

// Synchronous version for backward compatibility (uses cached rates)
export function calculateTotalWealthSync(
  moneyLocations: MoneyLocationData[]
): number {
  return moneyLocations.reduce((total, location) => {
    const rate = currencyService.getExchangeRates()[location.currency] || 1;
    return total + location.amount / rate;
  }, 0);
}
