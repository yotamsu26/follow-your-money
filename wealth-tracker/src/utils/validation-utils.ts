import { GoalData } from "../types/goal-types";

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
