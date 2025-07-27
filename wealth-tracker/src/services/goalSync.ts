import { GoalData } from "../types/goal-types";
import { MoneyLocationSync } from "../types/money-location-types";
import { Currency } from "../utils/currency-utils";
import { hasValidSyncData } from "../utils/validation-utils";
import { currencyService } from "./currencyService";
import { API_ENDPOINTS } from "../utils/routes";

export interface GoalSyncService {
  syncGoalsWithMoneyLocations: (
    goals: GoalData[],
    moneyLocations: any[],
    setGoals: React.Dispatch<React.SetStateAction<GoalData[]>>
  ) => Promise<void>;
}

export default function createGoalSync(apiClient: any): GoalSyncService {
  async function syncGoalsWithMoneyLocations(
    goals: GoalData[],
    moneyLocations: MoneyLocationSync[],
    setGoals: React.Dispatch<React.SetStateAction<GoalData[]>>
  ): Promise<void> {
    if (!hasValidSyncData(goals, moneyLocations)) {
      return;
    }
    const goalsToSync = goals.filter((goal) => goal.money_location_id);
    let hasUpdates = false;

    for (const goal of goalsToSync) {
      const connectedLocation = moneyLocations.find(
        (location) => location.money_location_id === goal.money_location_id
      );

      if (
        connectedLocation &&
        connectedLocation.amount !== goal.current_amount
      ) {
        const response = await apiClient.put(
          API_ENDPOINTS.GOALS.BY_ID(goal.goal_id),
          {
            current_amount: connectedLocation.amount,
            updated_at: new Date().toISOString(),
          }
        );

        if (response.success) {
          hasUpdates = true;
        }
      }
    }

    if (hasUpdates) {
      const updatedGoals = await Promise.all(
        goals.map(async (goal) => {
          const connectedLocation = moneyLocations.find(
            (location) => location.money_location_id === goal.money_location_id
          );

          if (
            connectedLocation &&
            connectedLocation.amount !== goal.current_amount
          ) {
            const goalCurrency = goal.currency || Currency.USD;
            const convertedAmount = await currencyService.convertCurrency(
              connectedLocation.amount,
              connectedLocation.currency as Currency,
              goalCurrency
            );

            return { ...goal, current_amount: convertedAmount };
          }
          return goal;
        })
      );

      setGoals(updatedGoals);
    }

    return;
  }

  return {
    syncGoalsWithMoneyLocations,
  };
}
