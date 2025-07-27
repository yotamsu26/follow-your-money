import { useState, useEffect, useMemo } from "react";
import createGoalApi from "../services/goalApi";
import { GoalData } from "../types/goal-types";
import { useApiClient } from "../contexts/ApiContext";

export function useGoals() {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const apiClient = useApiClient();

  const goalApi = useMemo(() => createGoalApi(apiClient), [apiClient]);

  async function loadGoals() {
    try {
      setIsLoading(true);
      const result = await goalApi.loadGoals();

      if (result.success && result.data) {
        setGoals(result.data);
        setError("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to fetch goals");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadGoals();
  }, []);

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
        setError(result.error);
        return false;
      }
    } catch (error) {
      setError("Failed to add goal");
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
        setError(result.error);
        return false;
      }
    } catch (error) {
      setError("Failed to update goal");
      return false;
    }
  }

  async function deleteGoal(goalId: string): Promise<boolean> {
    try {
      const result = await goalApi.deleteGoal(goalId);
      if (result.success) {
        await loadGoals();
        setError("");
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (error) {
      setError("Failed to delete goal");
      return false;
    }
  }

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: loadGoals,
    setError,
    setIsLoading,
    setGoals,
  };
}
