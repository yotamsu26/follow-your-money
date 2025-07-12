import { MoneyLocationData } from "../../hooks/useDashboard";
import {
  calculateAssetAllocation,
  calculateTotalWealth,
} from "../../utils/calculation-utils";
import { formatAccountType } from "../../utils/string-utils";

interface WealthSummaryProps {
  moneyLocations: MoneyLocationData[];
}

export function WealthSummary({ moneyLocations }: WealthSummaryProps) {
  function getAccountTypeColor(accountType: string) {
    switch (accountType) {
      case "cash":
        return "bg-green-500";
      case "bank_account":
        return "bg-blue-500";
      case "pension_account":
        return "bg-purple-500";
      case "real_estate":
        return "bg-orange-500";
      case "investment":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  const totalWealth = calculateTotalWealth(moneyLocations);
  const assetAllocation = calculateAssetAllocation(moneyLocations);
  const recentActivity = moneyLocations.length;
  const avgGrowth = findAvgGrowth();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Wealth */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <h3 className="text-sm font-medium opacity-90">Total Wealth</h3>
        <p className="text-2xl font-bold mt-2">
          ${totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="text-xs opacity-75 mt-1">Across all accounts</p>
      </div>

      {/* Asset Allocation Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Asset Allocation
        </h3>
        <div className="space-y-2">
          {assetAllocation.map((asset) => (
            <div key={asset.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${getAccountTypeColor(
                    asset.type
                  )}`}
                ></div>
                <span className="text-xs text-gray-600">
                  {formatAccountType(asset.type)}
                </span>
              </div>
              <span className="text-xs font-medium">
                {asset.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Active Accounts</h3>
        <p className="text-2xl font-bold mt-2 text-gray-900">
          {recentActivity}
        </p>
        <p className="text-xs text-gray-500 mt-1">Money locations tracked</p>
      </div>

      {/* Growth Rate */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
        <h3 className="text-sm font-medium opacity-90">Est. Growth Rate</h3>
        <p className="text-2xl font-bold mt-2">+{avgGrowth}%</p>
        <p className="text-xs opacity-75 mt-1">Annual estimated</p>
      </div>
    </div>
  );
}
