interface GoalAmountInputsProps {
  formData: {
    target_amount: string;
    current_amount: string;
    deadline: string;
    description: string;
    money_location_id: string;
    currency: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  today: string;
}

export function GoalAmountInputs({
  formData,
  handleChange,
  today,
}: GoalAmountInputsProps) {
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "ILS":
        return "₪";
      case "USD":
      default:
        return "$";
    }
  };

  const currencySymbol = getCurrencySymbol(formData.currency);

  return (
    <>
      {/* Target & Current Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="target_amount"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Target Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              {currencySymbol}
            </span>
            <input
              type="number"
              id="target_amount"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="10,000"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="current_amount"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Current Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              {currencySymbol}
            </span>
            <input
              type="number"
              id="current_amount"
              name="current_amount"
              value={formData.current_amount}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="0"
              min="0"
              step="0.01"
              disabled={!!formData.money_location_id}
            />
          </div>
          {formData.money_location_id && (
            <p className="text-xs text-gray-500 mt-1">
              Auto-filled from connected account
            </p>
          )}
        </div>
      </div>

      {/* Target Date */}
      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Target Date *
        </label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          min={today}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Must be a future date</p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
          placeholder="Why is this goal important to you?"
        />
      </div>
    </>
  );
}
