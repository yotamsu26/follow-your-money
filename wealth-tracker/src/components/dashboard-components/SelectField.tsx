import { ChevronDownIcon } from "../icons/ChevronDownIcon";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { value: string; label: string }[];
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-12 appearance-none bg-white cursor-pointer"
          required
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
