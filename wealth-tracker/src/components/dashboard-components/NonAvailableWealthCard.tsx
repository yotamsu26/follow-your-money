import { Currency, getCurrencySymbol } from "../../utils/currency-utils";
import currencyService from "../../services/currencyService";

interface NonAvailableWealthCardProps {
  nonAvailableWealth: number;
  convertedNonAvailableWealth: number;
  isLoading: boolean;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  supportedCurrencies: string[];
}

export function NonAvailableWealthCard({
  nonAvailableWealth,
  convertedNonAvailableWealth,
  isLoading,
  selectedCurrency,
  setSelectedCurrency,
  supportedCurrencies,
}: NonAvailableWealthCardProps) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium opacity-90">Non Available Wealth</h3>
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
            selectedCurrency as Currency
          )}${convertedNonAvailableWealth.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`
        )}
      </p>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs opacity-75">Pension, Education Fund</p>
        {selectedCurrency !== Currency.USD && !isLoading && (
          <p className="text-xs opacity-75">
            ≈ $
            {nonAvailableWealth.toLocaleString(undefined, {
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
  );
}
