import { useState, useEffect } from "react";
import { MoneyLocationData } from "../../hooks/useDashboard";
import {
  calculateAssetAllocation,
  calculateTotalWealth,
} from "../../utils/calculation-utils";
import { formatAccountType } from "../../utils/string-utils";
import currencyService from "../../services/currencyService";

interface WealthSummaryProps {
  moneyLocations: MoneyLocationData[];
}

export function WealthSummary({ moneyLocations }: WealthSummaryProps) {
  const [totalWealth, setTotalWealth] = useState<number>(0);
  const [assetAllocation, setAssetAllocation] = useState<
    Array<{
      type: string;
      amount: number;
      percentage: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [convertedWealth, setConvertedWealth] = useState<number>(0);
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);

  useEffect(() => {
    // Load supported currencies
    const loadCurrencies = async () => {
      try {
        await currencyService.getExchangeRates(); // Initialize rates
        const currencies = currencyService.getSupportedCurrencies();
        setSupportedCurrencies(currencies);
      } catch (error) {
        console.error("Error loading currencies:", error);
        setSupportedCurrencies(["USD", "EUR", "GBP", "ILS"]);
      }
    };
    loadCurrencies();
  }, []);

  useEffect(() => {
    async function calculateValues() {
      setIsLoading(true);
      try {
        const [wealth, allocation] = await Promise.all([
          calculateTotalWealth(moneyLocations),
          calculateAssetAllocation(moneyLocations),
        ]);
        setTotalWealth(wealth);
        setAssetAllocation(allocation);
      } catch (error) {
        console.error("Error calculating wealth summary:", error);
      }

      setIsLoading(false);
    }
    if (moneyLocations.length > 0) {
      calculateValues();
    } else {
      setTotalWealth(0);
      setAssetAllocation([]);
    }
  }, [moneyLocations]);

  useEffect(() => {
    // Convert total wealth to selected currency
    const convertWealth = async () => {
      if (totalWealth > 0 && selectedCurrency !== "USD") {
        try {
          const converted = await currencyService.convertCurrency(
            totalWealth,
            "USD",
            selectedCurrency
          );
          setConvertedWealth(converted);
        } catch (error) {
          setConvertedWealth(totalWealth);
        }
      } else {
        setConvertedWealth(totalWealth);
      }
    };

    convertWealth();
  }, [totalWealth, selectedCurrency]);

  function getCurrencySymbol(currency: string) {
    const symbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      ILS: "₪",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
      CHF: "CHF",
      CNY: "¥",
      INR: "₹",
    };
    return symbols[currency] || currency;
  }

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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Wealth</h3>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="text-xs bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded px-2 py-1 focus:outline-none focus:bg-opacity-30"
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency} className="text-gray-800">
                {currency}
              </option>
            ))}
          </select>
        </div>
        <p className="text-2xl font-bold">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `${getCurrencySymbol(
              selectedCurrency
            )}${convertedWealth.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`
          )}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs opacity-75">Across all accounts</p>
          {selectedCurrency !== "USD" && !isLoading && (
            <p className="text-xs opacity-75">
              ≈ $
              {totalWealth.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              USD
            </p>
          )}
        </div>
        {currencyService.isUsingLiveRates() && (
          <p className="text-xs opacity-60 mt-1">🟢 Live rates</p>
        )}
      </div>

      {/* Asset Allocation Chart */}
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
              <div
                key={asset.type}
                className="flex items-center justify-between"
              >
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
