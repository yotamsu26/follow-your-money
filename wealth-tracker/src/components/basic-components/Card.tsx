import { MoneyLocationData } from "../../hooks/useDashboard";
import {
  formatAccountType,
  formatAmount,
  formatDate,
} from "../../utils/string-utils";

interface CardProps {
  moneyLocationData: MoneyLocationData;
}

export function Card({ moneyLocationData }: CardProps) {
  function getAccountTypeColor(accountType: string) {
    switch (accountType) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "bank_account":
        return "bg-blue-100 text-blue-800";
      case "pension_account":
        return "bg-purple-100 text-purple-800";
      case "real_estate":
        return "bg-orange-100 text-orange-800";
      case "investment":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {moneyLocationData.location_name}
        </h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(
            moneyLocationData.account_type
          )}`}
        >
          {formatAccountType(moneyLocationData.account_type)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatAmount(moneyLocationData.amount, moneyLocationData.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Checked:</span>
          <span className="text-sm text-gray-900">
            {formatDate(moneyLocationData.last_checked)}
          </span>
        </div>

        {moneyLocationData.property_address && (
          <div className="border-t pt-3">
            <span className="text-sm text-gray-600">Property Address:</span>
            <p className="text-sm text-gray-900 mt-1">
              {moneyLocationData.property_address}
            </p>
          </div>
        )}

        {moneyLocationData.purchase_date && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Purchase Date:</span>
            <span className="text-sm text-gray-900">
              {formatDate(moneyLocationData.purchase_date)}
            </span>
          </div>
        )}

        {moneyLocationData.purchase_price && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Purchase Price:</span>
            <span className="text-sm text-gray-900">
              {formatAmount(
                moneyLocationData.purchase_price,
                moneyLocationData.currency
              )}
            </span>
          </div>
        )}

        {moneyLocationData.notes && (
          <div className="border-t pt-3">
            <span className="text-sm text-gray-600">Notes:</span>
            <p className="text-sm text-gray-900 mt-1">
              {moneyLocationData.notes}
            </p>
          </div>
        )}

        {moneyLocationData.attached_files &&
          moneyLocationData.attached_files.length > 0 && (
            <div className="border-t pt-3">
              <span className="text-sm text-gray-600">Attached Files:</span>
              <div className="mt-1">
                {moneyLocationData.attached_files.map((file, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-1"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
