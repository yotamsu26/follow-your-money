import { GoalData } from "../types/goal-types";
import { MoneyLocationSync } from "../types/money-location-types";
import { STORAGE_KEYS } from "../storage/local-storage-util";

export function hasValidSyncData(
  goals: GoalData[],
  moneyLocations: MoneyLocationSync[]
): boolean {
  return !!(
    moneyLocations?.length > 0 &&
    localStorage.getItem(STORAGE_KEYS.USER_DATA) &&
    goals.some((goal) => goal.money_location_id)
  );
}

export function isValidGoalData(goal: Partial<GoalData>): boolean {
  return !!(
    goal.name &&
    goal.target_amount &&
    goal.target_amount > 0 &&
    goal.currency
  );
}

export function isValidMoneyLocationId(id: string): boolean {
  return !!(id && id.trim().length > 0);
}
