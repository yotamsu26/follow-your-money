export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  ILS = "ILS",
}

export enum AccountType {
  CASH = "cash",
  BANK_ACCOUNT = "bank_account",
  PENSION_ACCOUNT = "pension_account",
  REAL_ESTATE = "real_estate",
  INVESTMENT = "investment",
}

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
