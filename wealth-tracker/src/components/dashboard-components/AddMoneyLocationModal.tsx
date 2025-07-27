import { useState } from "react";
import { Button } from "../basic-components/Button";
import { MoneyLocationForm } from "./MoneyLocationForm";
import { CURRENCIES } from "../../types/currencies";
import { ACCOUNT_TYPES } from "../../types/account-types";

interface AddMoneyLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any, files?: FileList) => Promise<boolean>;
  userName: string;
}

interface MoneyLocationFormData {
  location_name: string;
  amount: number;
  currency: string;
  account_type: string;
  property_address: string;
  purchase_date: string;
  purchase_price: number;
  notes: string;
}

const DEFAULT_FORM_DATA: MoneyLocationFormData = {
  location_name: "",
  amount: 0,
  currency: "USD",
  account_type: "cash",
  property_address: "",
  purchase_date: "",
  purchase_price: 0,
  notes: "",
};

export function AddMoneyLocationModal({
  isOpen,
  onClose,
  onAdd,
  userName,
}: AddMoneyLocationModalProps) {
  const [formData, setFormData] =
    useState<MoneyLocationFormData>(DEFAULT_FORM_DATA);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const moneyLocationId = `${userName}_${Date.now()}`;

      const moneyLocationData = {
        user_id: userName,
        money_location_id: moneyLocationId,
        ...formData,
        last_checked: new Date().toISOString(),
      };

      const success = await onAdd(moneyLocationData, uploadedFiles);

      if (success) {
        setFormData(DEFAULT_FORM_DATA);
        onClose();
      }
    } catch (error) {
      console.error("Error adding money location:", error);
    }
    setIsLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["amount", "purchase_price"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  }

  function handleFileChange(files: FileList | null) {
    if (files) {
      setUploadedFiles(files);
    }
  }

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <MoneyLocationForm
        formData={formData}
        onChange={handleChange}
        onFileChange={handleFileChange}
        currencies={CURRENCIES}
        accountTypes={ACCOUNT_TYPES}
      />
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading
            ? uploadedFiles && uploadedFiles.length > 0
              ? "Creating location and uploading files..."
              : "Creating location..."
            : "Add Location"}
        </Button>
      </div>
    </form>
  );
}
