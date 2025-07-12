import { useState } from "react";
import { Button } from "../basic-components/Button";
import { MoneyLocationForm } from "./MoneyLocationForm";

interface AddMoneyLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  userName: string;
}

export function AddMoneyLocationModal({
  isOpen,
  onClose,
  onAdd,
  userName,
}: AddMoneyLocationModalProps) {
  const [formData, setFormData] = useState({
    location_name: "",
    amount: 0,
    currency: "USD",
    account_type: "cash",
    property_address: "",
    purchase_date: "",
    purchase_price: 0,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const CURRENCIES = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "ILS", label: "ILS" },
  ];

  const ACCOUNT_TYPES = [
    { value: "cash", label: "Cash" },
    { value: "bank_account", label: "Bank Account" },
    { value: "pension_account", label: "Pension Account" },
    { value: "real_estate", label: "Real Estate" },
    { value: "investment", label: "Investment" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      onAdd({
        user_id: userName,
        money_location_id: `${userName}_${Date.now()}`,
        ...formData,
        last_checked: new Date().toISOString(),
      });
      setFormData({
        location_name: "",
        amount: 0,
        currency: "USD",
        account_type: "cash",
        property_address: "",
        purchase_date: "",
        purchase_price: 0,
        notes: "",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
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

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <MoneyLocationForm
        formData={formData}
        onChange={handleChange}
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
          {isLoading ? "Adding..." : "Add Location"}
        </Button>
      </div>
    </form>
  );
}
