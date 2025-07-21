import { Currency } from "../utils/currency-utils";
import { AccountType } from "./account-types";

export interface MoneyLocationData {
  user_id: string;
  money_location_id: string;
  location_name: string;
  amount: number;
  currency: Currency;
  last_checked: string;
  account_type: AccountType;
  property_address?: string;
  purchase_date?: string;
  purchase_price?: number;
  attached_files?: string[];
  notes?: string;
}
