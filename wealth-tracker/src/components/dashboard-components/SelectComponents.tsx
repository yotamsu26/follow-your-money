const selectClasses = "w-full border border-gray-300 rounded-md px-3 py-2 pr-8"; // <- arrow padding with pr-8

export function CurrencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  const options = ["USD", "EUR", "GBP", "ILS"];
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Currency
      </label>
      <select
        name="currency"
        value={value}
        onChange={onChange}
        className={selectClasses}
        required
      >
        {options.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AccountTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  const options = [
    { value: "cash", label: "Cash" },
    { value: "bank_account", label: "Bank Account" },
    { value: "pension_account", label: "Pension Account" },
    { value: "real_estate", label: "Real Estate" },
    { value: "investment", label: "Investment" },
  ];
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Account Type
      </label>
      <select
        name="account_type"
        value={value}
        onChange={onChange}
        className={selectClasses}
        required
      >
        {options.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}
