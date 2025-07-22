import { GoalCategory } from "./GoalForm";
import { Currency } from "../../utils/currency-utils";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";

interface GoalFormFieldsProps {
  formData: {
    name: string;
    category: string;
    currency: string;
    money_location_id: string;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export function GoalFormFields({
  formData,
  handleChange,
}: GoalFormFieldsProps) {
  const currencyLabels = {
    [Currency.USD]: "USD - US Dollar",
    [Currency.EUR]: "EUR - Euro",
    [Currency.GBP]: "GBP - British Pound",
    [Currency.ILS]: "ILS - Israeli Shekel",
  };

  return (
    <>
      {/* Goal Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Goal Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="e.g., Emergency Fund, House Down Payment"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Category
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all"
          >
            {Object.values(GoalCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Currency Selection */}
      <div>
        <label
          htmlFor="currency"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Currency
        </label>
        <div className="relative">
          <select
            id="currency"
            name="currency"
            value={formData.currency || "USD"}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all"
            disabled={!!formData.money_location_id}
          >
            {Object.values(Currency).map((currency) => (
              <option key={currency} value={currency}>
                {currencyLabels[currency]}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.money_location_id
            ? "Auto-filled from connected account"
            : "Select the currency for your goal amounts"}
        </p>
      </div>
    </>
  );
}
