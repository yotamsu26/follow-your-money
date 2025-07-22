import { MoneyLocationData } from "../../types/money-location-types";

interface GrowthRateCardProps {
  moneyLocations: MoneyLocationData[];
}

export function GrowthRateCard({ moneyLocations }: GrowthRateCardProps) {
  function findAvgGrowth() {
    // value / time = growth rate
    const growthRates = moneyLocations.map((location) => {
      const purchaseDate = new Date(location.purchase_date);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - purchaseDate.getTime();
      const growthRate = location.amount / timeDiff;

      return growthRate;
    });
    return Math.round(
      growthRates.reduce((a, b) => a + b, 0) / growthRates.length
    );
  }

  const avgGrowth = findAvgGrowth();

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
      <h3 className="text-sm font-medium opacity-90">Est. Growth Rate</h3>
      <p className="text-2xl font-bold mt-2">+{avgGrowth}%</p>
      <p className="text-xs opacity-75 mt-1">Annual estimated</p>
    </div>
  );
}
