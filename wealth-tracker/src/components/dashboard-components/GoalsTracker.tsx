import { useState } from "react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface GoalsTrackerProps {
  totalWealth: number;
}

export function GoalsTracker({ totalWealth }: GoalsTrackerProps) {
  // Sample goals data (in a real app, this would come from the database)
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: totalWealth * 0.3,
      deadline: "2024-12-31",
      category: "Safety",
    },
    {
      id: "2",
      name: "House Down Payment",
      targetAmount: 50000,
      currentAmount: totalWealth * 0.4,
      deadline: "2025-06-01",
      category: "Real Estate",
    },
    {
      id: "3",
      name: "Retirement Fund",
      targetAmount: 100000,
      currentAmount: totalWealth * 0.6,
      deadline: "2030-12-31",
      category: "Retirement",
    },
  ]);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCategoryIcon = (category: string) => {
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
  };

  const daysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Financial Goals</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateProgress(
            goal.currentAmount,
            goal.targetAmount
          );
          const daysLeft = daysUntilDeadline(goal.deadline);

          return (
            <div
              key={goal.id}
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
                    ${goal.currentAmount.toLocaleString()} / $
                    {goal.targetAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                  </p>
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
                  <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
                    Update Progress
                  </button>
                  <button className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded hover:bg-gray-100">
                    Edit Goal
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  ${(goal.targetAmount - goal.currentAmount).toLocaleString()}{" "}
                  to go
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-green-600">
              {
                goals.filter(
                  (g) =>
                    calculateProgress(g.currentAmount, g.targetAmount) >= 100
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
                    calculateProgress(g.currentAmount, g.targetAmount) >= 50 &&
                    calculateProgress(g.currentAmount, g.targetAmount) < 100
                ).length
              }
            </p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">
              $
              {goals
                .reduce((sum, g) => sum + g.targetAmount, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Total Target</p>
          </div>
        </div>
      </div>
    </div>
  );
}
