import { MoneyLocationData } from "../../types/money-location-types";

interface CardModalsProps {
  moneyLocationData: MoneyLocationData;
  showUpdateAmount: boolean;
  setShowUpdateAmount: (show: boolean) => void;
  newAmount: string;
  setNewAmount: (amount: string) => void;
  isUpdating: boolean;
  handleUpdateAmount: () => Promise<void>;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  isDeleting: boolean;
  handleDelete: () => Promise<void>;
}

export function CardModals({
  moneyLocationData,
  showUpdateAmount,
  setShowUpdateAmount,
  newAmount,
  setNewAmount,
  isUpdating,
  handleUpdateAmount,
  showDeleteConfirm,
  setShowDeleteConfirm,
  isDeleting,
  handleDelete,
}: CardModalsProps) {
  return (
    <>
      {/* Update Amount Dialog */}
      {showUpdateAmount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Update Current Value
            </h3>
            <p className="text-gray-600 mb-4">
              Update the current value for "{moneyLocationData.location_name}"
            </p>
            <div className="mb-6">
              <label
                htmlFor="newAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Current Value ({moneyLocationData.currency})
              </label>
              <input
                type="number"
                id="newAmount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new current value"
                min="0"
                step="0.01"
                disabled={isUpdating}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUpdateAmount(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAmount}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Money Location
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{moneyLocationData.location_name}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
