import { wrapFetch } from "../api/api-calls";
import { getItem } from "../storage/local-storage-util";
import { GoalData } from "../types/types";

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

export function createGoalApi(handleAuthFailure: () => void): GoalApiService {
  async function loadGoals(): Promise<{
    success: boolean;
    data?: GoalData[];
    error?: string;
  }> {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return { success: false, error: "No user data" };
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      if (!token) {
        handleAuthFailure();
        return { success: false, error: "No token" };
      }

      const response = await wrapFetch(
        `http://localhost:3020/goals/${parsedUserData.userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return { success: false, error: "Authentication failed" };
      }

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return {
          success: false,
          error: data.message || "Failed to fetch goals",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function addGoal(
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return { success: false, error: "No user data" };
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      // Generate a unique goal ID
      const goalId = `goal_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const response = await wrapFetch("http://localhost:3020/goals", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...goalData,
          goal_id: goalId,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return { success: false, error: "Authentication failed" };
      }

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.message || "Failed to add goal" };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function updateGoal(
    goalId: string,
    updateData: Partial<GoalData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return { success: false, error: "No user data" };
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/goals/${goalId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return { success: false, error: "Authentication failed" };
      }

      if (data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Failed to update goal",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function deleteGoal(
    goalId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return { success: false, error: "No user data" };
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/goals/${goalId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return { success: false, error: "Authentication failed" };
      }

      if (data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Failed to delete goal",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  return {
    loadGoals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
