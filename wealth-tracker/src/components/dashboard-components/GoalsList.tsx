import { GoalData } from "../../types/types";
import { formatCurrencyAmount } from "../../utils/currency-utils";

interface GoalsListProps {
  goals: GoalData[];
  onEditGoal: (goal: GoalData) => void;
  onDeleteGoal: (goalId: string) => Promise<void>;
}

export function GoalsList({ goals, onEditGoal, onDeleteGoal }: GoalsListProps) {
  function calculateProgress(current: number, target: number): number {
    return Math.min((current / target) * 100, 100);
  }

  function getProgressColor(progress: number): string {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  }

  function getCategoryIcon(category: string): string {
    switch (category) {
      case "Safety":
        return "🛡️";
      case "Real Estate":
        return "🏠";
      case "Retirement":
        return "💰";
      default:
        return "🎯";
    }
  }

  function daysUntilDeadline(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  async function handleDeleteGoal(goalId: string): Promise<void> {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await onDeleteGoal(goalId);
    }
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🎯</div>
        <p className="text-gray-500">No goals set yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Add your first financial goal to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateProgress(
            goal.current_amount,
            goal.target_amount
          );
          const daysLeft = daysUntilDeadline(goal.deadline);

          return (
            <div
              key={goal.goal_id}
              className="border border-gray-100 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getCategoryIcon(goal.category)}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">{goal.name}</h4>
                    <p className="text-xs text-gray-500">{goal.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {formatCurrencyAmount(goal.current_amount, goal.currency)} /{" "}
                    {formatCurrencyAmount(goal.target_amount, goal.currency)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                  </p>
                  {goal.money_location_id && (
                    <p className="text-xs text-blue-600 mt-1">
                      🔗 Connected to {goal.money_location_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-gray-800">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                      progress
                    )}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Goal Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditGoal(goal)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                  >
                    Edit Goal
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.goal_id)}
                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  ${(goal.target_amount - goal.current_amount).toLocaleString()}{" "}
                  to go
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {goals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">
                {
                  goals.filter(
                    (g) =>
                      calculateProgress(g.current_amount, g.target_amount) >=
                      100
                  ).length
                }
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div>
              <p className="text-lg font-bold text-yellow-600">
                {
                  goals.filter(
                    (g) =>
                      calculateProgress(g.current_amount, g.target_amount) >=
                        50 &&
                      calculateProgress(g.current_amount, g.target_amount) < 100
                  ).length
                }
              </p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">
                $
                {goals
                  .reduce((sum, g) => sum + g.target_amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Target</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
