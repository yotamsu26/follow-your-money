import { AccountType } from "../../types/account-types";
import { Input } from "../basic-components/Input";
import { SelectField } from "./SelectField";

interface MoneyLocationFormProps {
  formData: any;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  onFileChange?: (files: FileList | null) => void;
  currencies: { value: string; label: string }[];
  accountTypes: { value: string; label: string }[];
}

export function MoneyLocationForm({
  formData,
  onChange,
  onFileChange,
  currencies,
  accountTypes,
}: MoneyLocationFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location Name"
          name="location_name"
          value={formData.location_name}
          onChange={onChange}
          required
        />
        <Input
          label="Current Value"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={onChange}
          required
        />
        <SelectField
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={onChange}
          options={currencies}
        />
        <SelectField
          label="Account Type"
          name="account_type"
          value={formData.account_type}
          onChange={onChange}
          options={accountTypes}
        />
      </div>

      {formData.account_type === AccountType.REAL_ESTATE && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Property Address"
              name="property_address"
              value={formData.property_address}
              onChange={onChange}
              placeholder="123 Main St, City, State"
            />
            <Input
              label="Purchase Date"
              name="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={onChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Purchase Price"
              name="purchase_price"
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={onChange}
            />
          </div>

          {onFileChange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Documents
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => onFileChange(e.target.files)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload documents such as property deeds, appraisals, or photos
              </p>
            </div>
          )}
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Optional notes..."
        />
      </div>
    </>
  );
}
