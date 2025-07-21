import { GoalData } from "../../types/types";
import { MoneyLocationData } from "../../types/money-location-types";
import { useGoalForm } from "../../hooks/useGoalForm";
import { GoalFormFields } from "./GoalFormFields";
import { GoalMoneyLocationConnection } from "./GoalMoneyLocationConnection";
import { GoalAmountInputs } from "./GoalAmountInputs";

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ) => Promise<boolean>;
  goal?: GoalData | null;
  userName: string;
  moneyLocations: MoneyLocationData[];
}

export enum GoalCategory {
  SAFETY = "Safety",
  REAL_ESTATE = "Real Estate",
  RETIREMENT = "Retirement",
  EDUCATION = "Education",
  TRAVEL = "Travel",
  INVESTMENT = "Investment",
  OTHER = "Other",
}

export function GoalForm({
  isOpen,
  onClose,
  onSubmit,
  goal,
  userName,
  moneyLocations,
}: GoalFormProps) {
  const { formData, isSubmitting, error, handleSubmit, handleChange } =
    useGoalForm({
      goal,
      userName,
      moneyLocations,
      onSubmit,
      onClose,
    });

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Validate future date
  const validateDate = (dateString: string) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
    return selectedDate > currentDate;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate future date
    if (!validateDate(formData.deadline)) {
      alert("Please select a future date for your goal deadline.");
      return;
    }

    handleSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {goal ? "Edit Financial Goal" : "Create New Goal"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <span className="text-xl text-gray-500">×</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          <GoalFormFields formData={formData} handleChange={handleChange} />

          <GoalMoneyLocationConnection
            formData={formData}
            moneyLocations={moneyLocations}
            handleChange={handleChange}
          />

          <GoalAmountInputs
            formData={formData}
            handleChange={handleChange}
            today={today}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : goal
                ? "Update Goal"
                : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
