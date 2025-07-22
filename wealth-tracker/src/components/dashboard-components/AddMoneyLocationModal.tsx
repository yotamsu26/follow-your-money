import { useState } from "react";
import { Button } from "../basic-components/Button";
import { MoneyLocationForm } from "./MoneyLocationForm";
import { CURRENCIES } from "../../types/currencies";
import { ACCOUNT_TYPES } from "../../types/account-types";
import { wrapFetch } from "../../api/api-calls";

interface AddMoneyLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => Promise<void>;
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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

      await onAdd(moneyLocationData);

      if (uploadedFiles.length > 0) {
        try {
          await uploadFiles(moneyLocationId, uploadedFiles);
        } catch (error) {
          console.error("File upload failed:", error);
          alert(
            "Money location created, but file upload failed. You can upload files later from the money location card."
          );
        }
      }

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
      setUploadedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error adding money location:", error);
      alert("Failed to create money location. Please try again.");
    }
    setIsLoading(false);
  }

  async function uploadFiles(moneyLocationId: string, files: File[]) {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("No user data found");
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await wrapFetch(
        `http://localhost:3020/files/upload/${moneyLocationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload files");
      }

      const result = await response.json();
      console.log("Files uploaded successfully:", result);
      return result;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error; // Re-throw to handle in the main function
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

  function handleFileChange(files: FileList | null) {
    if (files) {
      setUploadedFiles(Array.from(files));
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
            ? uploadedFiles.length > 0
              ? "Creating location and uploading files..."
              : "Creating location..."
            : "Add Location"}
        </Button>
      </div>
    </form>
  );
}
