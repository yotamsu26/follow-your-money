import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { removeItem } from "../storage/local-storage-util";
import { createGoalApi } from "../services/goalApi";
import { createGoalSync } from "../services/goalSync";
import { GoalData } from "../../../server/db/database-schemas";

export function useGoals() {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  function handleAuthFailure() {
    removeItem("userData");
    router.push("/");
  }

  // Create API and sync services with memoization
  const goalApi = useMemo(() => createGoalApi(handleAuthFailure), []);
  const goalSync = useMemo(() => createGoalSync(handleAuthFailure), []);

  // Load goals from API
  async function loadGoals() {
    try {
      setIsLoading(true);
      const result = await goalApi.loadGoals();

      if (result.success && result.data) {
        setGoals(result.data);
        setError("");
      } else {
        setError(result.error || "Failed to fetch goals");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadGoals();
  }, []);

  // Add a new goal
  async function addGoal(
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ): Promise<boolean> {
    try {
      const result = await goalApi.addGoal(goalData);

      if (result.success) {
        await loadGoals();
        setError("");
        return true;
      } else {
        setError(result.error || "Failed to add goal");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    }
  }

  async function updateGoal(
    goalId: string,
    updateData: Partial<GoalData>
  ): Promise<boolean> {
    try {
      const result = await goalApi.updateGoal(goalId, updateData);

      if (result.success) {
        await loadGoals();
        setError("");
        return true;
      } else {
        setError(result.error || "Failed to update goal");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    }
  }

  // Delete a goal
  async function deleteGoal(goalId: string): Promise<boolean> {
    try {
      const result = await goalApi.deleteGoal(goalId);

      if (result.success) {
        await loadGoals();
        setError("");
        return true;
      } else {
        setError(result.error || "Failed to delete goal");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    }
  }

  // Sync goals with money locations
  const syncGoalsWithMoneyLocations = async (
    moneyLocations: any[]
  ): Promise<boolean> => {
    return await goalSync.syncGoalsWithMoneyLocations(
      goals,
      moneyLocations,
      setGoals,
      loadGoals
    );
  };

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: loadGoals,
    syncGoalsWithMoneyLocations,
    setError,
  };
}
