import { formatAccountType } from "../../utils/string-utils";

interface AssetAllocationCardProps {
  assetAllocation: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
  isLoading: boolean;
}

export function AssetAllocationCard({
  assetAllocation,
  isLoading,
}: AssetAllocationCardProps) {
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

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Asset Allocation
      </h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-8"></div>
              </div>
            ))}
          </div>
        ) : (
          assetAllocation.map((asset) => (
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
          ))
        )}
      </div>
    </div>
  );
}
