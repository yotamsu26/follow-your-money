import { useState, useEffect } from "react";
import { useGoals } from "../../hooks/useGoals";
import { GoalData } from "../../types/types";
import { GoalForm } from "./GoalForm";
import { GoalsList } from "./GoalsList";
import { MoneyLocationData } from "../../hooks/useDashboard";

interface GoalsTrackerProps {
  userName: string;
  moneyLocations: MoneyLocationData[];
}

export function GoalsTracker({ userName, moneyLocations }: GoalsTrackerProps) {
  const {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    syncGoalsWithMoneyLocations,
    setError,
  } = useGoals();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null);

  // Auto-sync goals with money locations when money locations change
  useEffect(() => {
    if (!isLoading && goals.length > 0 && moneyLocations.length > 0) {
      syncGoalsWithMoneyLocations(moneyLocations);
    }
  }, [moneyLocations, isLoading, syncGoalsWithMoneyLocations]);

  async function handleAddGoal(
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ) {
    const success = await addGoal(goalData);
    if (success) {
      setShowAddForm(false);
    }
    return success;
  }

  async function handleUpdateGoal(
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ) {
    if (!editingGoal) return false;

    const success = await updateGoal(editingGoal.goal_id, goalData);
    if (success) {
      setEditingGoal(null);
    }
    return success;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Financial Goals</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Add Goal
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError("")}
            className="float-right font-bold text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <GoalsList
        key={`goals-${goals.length}-${goals
          .map((g) => g.current_amount)
          .join("-")}`}
        goals={goals}
        onEditGoal={setEditingGoal}
        onDeleteGoal={async (goalId) => {
          await deleteGoal(goalId);
        }}
      />

      {/* Goal Forms */}
      <GoalForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddGoal}
        userName={userName}
        moneyLocations={moneyLocations}
      />

      <GoalForm
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        onSubmit={handleUpdateGoal}
        goal={editingGoal}
        userName={userName}
        moneyLocations={moneyLocations}
      />
    </div>
  );
}
