import { Currency } from "../utils/currency-utils";

export interface GoalData {
  goal_id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category: string;
  currency?: Currency;
  description?: string;
  money_location_id?: string;
  money_location_name?: string;
  created_at: string;
  updated_at: string;
}
