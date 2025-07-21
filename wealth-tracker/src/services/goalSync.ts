import { wrapFetch } from "../api/api-calls";
import { getItem } from "../storage/local-storage-util";
import { GoalData } from "../../../server/db/database-schemas";
import currencyService from "./currencyService";

export interface GoalSyncService {
  syncGoalsWithMoneyLocations: (
    goals: GoalData[],
    moneyLocations: any[],
    setGoals: React.Dispatch<React.SetStateAction<GoalData[]>>,
    loadGoals: () => Promise<void>
  ) => Promise<boolean>;
}

export function createGoalSync(handleAuthFailure: () => void): GoalSyncService {
  async function syncGoalsWithMoneyLocations(
    goals: GoalData[],
    moneyLocations: any[],
    setGoals: React.Dispatch<React.SetStateAction<GoalData[]>>,
    loadGoals: () => Promise<void>
  ): Promise<boolean> {
    // Only sync if we have money locations
    if (!moneyLocations || moneyLocations.length === 0) {
      return false;
    }

    const userData = getItem("userData");
    if (!userData) {
      return false;
    }

    try {
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      // Use current goals in state (they're already fresh from the dashboard)
      const goalsToSync = goals.filter((goal) => goal.money_location_id);

      if (goalsToSync.length === 0) {
        return false;
      }

      let updatedAny = false;

      for (const goal of goalsToSync) {
        // Find the connected money location
        const connectedLocation = moneyLocations.find(
          (ml) => ml.money_location_id === goal.money_location_id
        );

        if (
          connectedLocation &&
          connectedLocation.amount !== goal.current_amount
        ) {
          // Update the goal's current amount in the database
          const updateResponse = await wrapFetch(
            `http://localhost:3020/goals/${goal.goal_id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_amount: connectedLocation.amount,
                updated_at: new Date().toISOString(),
              }),
            }
          );

          if (updateResponse.status === 401 || updateResponse.status === 403) {
            handleAuthFailure();
            return false;
          }

          const updateData = await updateResponse.json();
          if (updateData.success) {
            updatedAny = true;
          }
        }
      }

      // Force refresh goals from database to show updated values immediately
      if (updatedAny) {
        const updatedGoals = await Promise.all(
          goals.map(async (goal) => {
            const connectedLocation = moneyLocations.find(
              (ml) => ml.money_location_id === goal.money_location_id
            );
            if (
              connectedLocation &&
              connectedLocation.amount !== goal.current_amount
            ) {
              // Convert the amount to the goal's currency (default to USD if not set)
              const goalCurrency = goal.currency || "USD";
              const convertedAmount = await currencyService.convertCurrency(
                connectedLocation.amount,
                connectedLocation.currency,
                goalCurrency
              );

              return { ...goal, current_amount: convertedAmount };
            }
            return goal;
          })
        );

        // Update state with currency-converted amounts
        setGoals(updatedGoals);

        // Also refresh from database to ensure consistency
        await loadGoals();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  return {
    syncGoalsWithMoneyLocations,
  };
}
