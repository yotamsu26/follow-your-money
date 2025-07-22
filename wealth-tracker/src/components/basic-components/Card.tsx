import { useState } from "react";
import { MoneyLocationData } from "../../types/money-location-types";
import {
  formatAccountType,
  formatAmount,
  formatDate,
} from "../../utils/string-utils";
import { CardModals } from "./CardModals";
import { Tooltip } from "./Tooltip";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { FilesList } from "./FilesList";
import { AccountType } from "../../types/account-types";

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
        <Tooltip
          text={moneyLocationData.location_name}
          className="flex-1 min-w-0"
        >
          <h3
            className="text-lg font-semibold text-gray-800 truncate"
            data-truncate="true"
          >
            {moneyLocationData.location_name}
          </h3>
        </Tooltip>
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
              title="Update current value"
            >
              <EditIcon />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Delete money location"
            >
              <DeleteIcon />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {moneyLocationData.account_type === AccountType.REAL_ESTATE ? (
          <RealEstateDetails moneyLocationData={moneyLocationData} />
        ) : (
          <StandardAccountDetails moneyLocationData={moneyLocationData} />
        )}

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

        <FilesList moneyLocationId={moneyLocationData.money_location_id} />
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

function RealEstateDetails({ moneyLocationData }: { moneyLocationData: any }) {
  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Current Value:</span>
        <span className="text-lg font-bold text-gray-900">
          {formatAmount(moneyLocationData.amount, moneyLocationData.currency)}
        </span>
      </div>
      {moneyLocationData.purchase_price && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Purchase Price:</span>
          <span className="text-sm text-gray-700">
            {formatAmount(
              moneyLocationData.purchase_price,
              moneyLocationData.currency
            )}
          </span>
        </div>
      )}
    </>
  );
}

function StandardAccountDetails({
  moneyLocationData,
}: {
  moneyLocationData: any;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Current Value:</span>
      <span className="text-lg font-bold text-gray-900">
        {formatAmount(moneyLocationData.amount, moneyLocationData.currency)}
      </span>
    </div>
  );
}
