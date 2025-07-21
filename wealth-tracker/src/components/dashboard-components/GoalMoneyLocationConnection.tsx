import { MoneyLocationData } from "../../types/money-location-types";

interface GoalMoneyLocationConnectionProps {
  formData: {
    money_location_id: string;
  };
  moneyLocations: MoneyLocationData[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function GoalMoneyLocationConnection({
  formData,
  moneyLocations,
  handleChange,
}: GoalMoneyLocationConnectionProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <label
        htmlFor="money_location_id"
        className="block text-sm font-semibold text-blue-800 mb-2"
      >
        🔗 Connect to Money Location
      </label>
      <div className="relative">
        <select
          id="money_location_id"
          name="money_location_id"
          value={formData.money_location_id}
          onChange={handleChange}
          className="w-full px-4 py-3 pr-12 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all"
        >
          <option value="">No connection (manual tracking)</option>
          {moneyLocations.map((location) => (
            <option
              key={location.money_location_id}
              value={location.money_location_id}
            >
              {location.location_name} ({location.currency}{" "}
              {location.amount.toLocaleString()})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {moneyLocations.length === 0 && (
        <p className="text-xs text-orange-600 mt-2 flex items-center">
          <span className="mr-1">⚠️</span>
          No money locations available. Create one first to enable auto-sync.
        </p>
      )}

      {formData.money_location_id && (
        <p className="text-xs text-blue-700 mt-2 flex items-center">
          <span className="mr-1">💡</span>
          Current amount will automatically sync with this account balance.
        </p>
      )}
    </div>
  );
}
