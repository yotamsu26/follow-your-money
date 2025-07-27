import { GoalData } from "../types/goal-types";
import { MoneyLocationSync } from "../types/money-location-types";
import { Currency } from "../utils/currency-utils";
import { currencyService } from "./currencyService";
import { API_ENDPOINTS } from "../utils/routes";

export interface GoalSyncService {
  syncGoalsWithMoneyLocations: (
    goals: GoalData[],
    moneyLocations: any[],
    setGoals: React.Dispatch<React.SetStateAction<GoalData[]>>
  ) => Promise<void>;
}

function filterGoalsToSync(goals: GoalData[]): GoalData[] {
  return goals.filter((goal) => goal.money_location_id);
}

function findConnectedLocation(
  goal: GoalData,
  moneyLocations: MoneyLocationSync[]
): MoneyLocationSync | undefined {
  return moneyLocations.find(
    (location) => location.money_location_id === goal.money_location_id
  );
}

async function updateGoalInDatabase(
  apiClient: any,
  goalId: string,
  amount: number
): Promise<boolean> {
  const response = await apiClient.put(API_ENDPOINTS.GOALS.BY_ID(goalId), {
    current_amount: amount,
    updated_at: new Date().toISOString(),
  });

  return response.success;
}

async function updateGoalsFromMoneyLocations(
  apiClient: any,
  goals: GoalData[],
  moneyLocations: MoneyLocationSync[]
): Promise<boolean> {
  const goalsToSync = filterGoalsToSync(goals);
  let hasUpdates = false;

  for (const goal of goalsToSync) {
    const connectedLocation = findConnectedLocation(goal, moneyLocations);

    if (connectedLocation && connectedLocation.amount !== goal.current_amount) {
      const success = await updateGoalInDatabase(
        apiClient,
        goal.goal_id,
        connectedLocation.amount
      );

      if (success) {
        hasUpdates = true;
      }
    }
  }

  return hasUpdates;
}

async function convertGoalAmounts(
  goals: GoalData[],
  moneyLocations: MoneyLocationSync[]
): Promise<GoalData[]> {
  return Promise.all(
    goals.map(async (goal) => {
      const connectedLocation = findConnectedLocation(goal, moneyLocations);

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
}

function removeGoalsWithDeletedLocations(
  goals: GoalData[],
  moneyLocations: MoneyLocationSync[]
): GoalData[] {
  const deletedGoals = goals.filter(
    (goal) =>
      goal.money_location_id &&
      !moneyLocations.find(
        (location) => location.money_location_id === goal.money_location_id
      )
  );

  if (deletedGoals.length > 0) {
    return goals.filter(
      (goal) =>
        !deletedGoals.some(
          (deletedGoal) => deletedGoal.goal_id === goal.goal_id
        )
    );
  }

  return goals;
}

export default function createGoalSync(apiClient: any): GoalSyncService {
  async function syncGoalsWithMoneyLocations(
    goals: GoalData[],
    moneyLocations: MoneyLocationSync[],
    setGoals: React.Dispatch<React.SetStateAction<GoalData[]>>
  ): Promise<void> {
    const hasUpdates = await updateGoalsFromMoneyLocations(
      apiClient,
      goals,
      moneyLocations
    );

    if (hasUpdates) {
      const updatedGoals = await convertGoalAmounts(goals, moneyLocations);
      setGoals(updatedGoals);
    }

    const goalsAfterDeletion = removeGoalsWithDeletedLocations(
      goals,
      moneyLocations
    );

    if (goalsAfterDeletion.length !== goals.length) {
      setGoals(goalsAfterDeletion);
    }

    return;
  }

  return {
    syncGoalsWithMoneyLocations,
  };
}
