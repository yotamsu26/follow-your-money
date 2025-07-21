import { useState } from "react";
import { MoneyLocationData } from "../../types/money-location-types";
import {
  formatAccountType,
  formatAmount,
  formatDate,
} from "../../utils/string-utils";
import { CardModals } from "./CardModals";

interface CardProps {
  moneyLocationData: MoneyLocationData;
  onDelete?: (moneyLocationId: string) => Promise<boolean>;
  onUpdateAmount?: (
    moneyLocationId: string,
    newAmount: number
  ) => Promise<boolean>;
}

export function Card({
  moneyLocationData,
  onDelete,
  onUpdateAmount,
}: CardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUpdateAmount, setShowUpdateAmount] = useState(false);
  const [newAmount, setNewAmount] = useState(
    moneyLocationData.amount.toString()
  );
  const [isUpdating, setIsUpdating] = useState(false);

  function getAccountTypeColor(accountType: string) {
    switch (accountType) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "bank_account":
        return "bg-blue-100 text-blue-800";
      case "pension_account":
        return "bg-purple-100 text-purple-800";
      case "real_estate":
        return "bg-orange-100 text-orange-800";
      case "investment":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  async function handleDelete() {
    if (!onDelete) return;

    setIsDeleting(true);
    const success = await onDelete(moneyLocationData.money_location_id);
    if (success) {
      setShowDeleteConfirm(false);
    }
    setIsDeleting(false);
  }

  async function handleUpdateAmount() {
    if (!onUpdateAmount) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsUpdating(true);
    try {
      const success = await onUpdateAmount(
        moneyLocationData.money_location_id,
        amount
      );
      if (success) {
        setShowUpdateAmount(false);
      }
    } catch (error) {
      console.error("Error updating money location:", error);
      alert("Failed to update amount. Please try again.");
    }
    setIsUpdating(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {moneyLocationData.location_name}
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(
              moneyLocationData.account_type
            )}`}
          >
            {formatAccountType(moneyLocationData.account_type)}
          </span>
          {onUpdateAmount && (
            <button
              onClick={() => setShowUpdateAmount(true)}
              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
              title="Update amount"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Delete money location"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatAmount(moneyLocationData.amount, moneyLocationData.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Checked:</span>
          <span className="text-sm text-gray-900">
            {formatDate(moneyLocationData.last_checked)}
          </span>
        </div>

        {moneyLocationData.property_address && (
          <div className="border-t pt-3">
            <span className="text-sm text-gray-600">Property Address:</span>
            <p className="text-sm text-gray-900 mt-1">
              {moneyLocationData.property_address}
            </p>
          </div>
        )}

        {moneyLocationData.purchase_date && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Purchase Date:</span>
            <span className="text-sm text-gray-900">
              {formatDate(moneyLocationData.purchase_date)}
            </span>
          </div>
        )}

        {moneyLocationData.notes && (
          <div className="border-t pt-3">
            <span className="text-sm text-gray-600">Notes:</span>
            <p className="text-sm text-gray-900 mt-1">
              {moneyLocationData.notes}
            </p>
          </div>
        )}

        {moneyLocationData.attached_files &&
          moneyLocationData.attached_files.length > 0 && (
            <div className="border-t pt-3">
              <span className="text-sm text-gray-600">Attached Files:</span>
              <div className="mt-1">
                {moneyLocationData.attached_files.map((file, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-1"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      <CardModals
        moneyLocationData={moneyLocationData}
        showUpdateAmount={showUpdateAmount}
        setShowUpdateAmount={setShowUpdateAmount}
        newAmount={newAmount}
        setNewAmount={setNewAmount}
        isUpdating={isUpdating}
        handleUpdateAmount={handleUpdateAmount}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </div>
  );
}
