import { GoalData } from "../types/goal-types";
import { API_ENDPOINTS } from "../utils/routes";
import { getUserData } from "../api/auth-utils";

export interface GoalApiService {
  loadGoals: () => Promise<{
    success: boolean;
    data?: GoalData[];
    error?: string;
  }>;
  addGoal: (
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ) => Promise<{ success: boolean; error?: string }>;
  updateGoal: (
    goalId: string,
    updateData: Partial<GoalData>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteGoal: (goalId: string) => Promise<{ success: boolean; error?: string }>;
}

function generateGoalId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function createGoalApi(apiClient: any): GoalApiService {
  async function loadGoals(): Promise<{
    success: boolean;
    data?: GoalData[];
    error?: string;
  }> {
    const userData = getUserData();
    if (!userData) {
      return { success: false, error: "No user data available" };
    }

    const response = await apiClient.get(
      API_ENDPOINTS.GOALS.BY_USER(userData.userName)
    );

    if (response.success) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.error || "Failed to fetch goals",
      };
    }
  }

  async function addGoal(
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ): Promise<{ success: boolean; error?: string }> {
    const goalWithId = {
      ...goalData,
      goal_id: generateGoalId(),
    };

    const response = await apiClient.post(API_ENDPOINTS.GOALS.BASE, goalWithId);

    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || "Failed to add goal" };
    }
  }

  async function updateGoal(
    goalId: string,
    updateData: Partial<GoalData>
  ): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.put(
      API_ENDPOINTS.GOALS.BY_ID(goalId),
      updateData
    );

    if (response.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.error || "Failed to update goal",
      };
    }
  }

  async function deleteGoal(
    goalId: string
  ): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.delete(API_ENDPOINTS.GOALS.BY_ID(goalId));

    if (response.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.error || "Failed to delete goal",
      };
    }
  }

  return {
    loadGoals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
