import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://yotamsu26:wU60TrQxrpfAEDPN@wealthdata.mixbayt.mongodb.net/?retryWrites=true&w=majority&appName=WealthData";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
  INVESTMENT = "investment",
}

export enum ExpenseCategory {
  FOOD = "food",
  TRANSPORTATION = "transportation",
  HOUSING = "housing",
  UTILITIES = "utilities",
  ENTERTAINMENT = "entertainment",
  SHOPPING = "shopping",
  EDUCATION = "education",
  INVESTMENT = "investment",
  OTHER = "other",
}

export interface MoneyLocationData {
  user_id: string;
  money_location_id: string;
  location_name: string;
  amount: number;
  currency: Currency;
  last_checked: Date;
  account_type: AccountType;
  property_address?: string;
  purchase_date?: Date;
  purchase_price?: number;
  attached_files?: string[];
  notes?: string;
}

export interface TransactionData {
  transaction_id: string;
  user_id: string;
  money_location_id: string;
  type: TransactionType;
  category: ExpenseCategory;
  amount: number;
  currency: Currency;
  description: string;
  date: Date;
  receipt_url?: string;
  tags?: string[];
  created_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export async function connect() {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to db:", error);
    throw error;
  }
}
