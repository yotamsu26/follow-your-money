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

export async function connect() {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to db:", error);
    throw error;
  }
}

export async function insertMoneyLocation(data: MoneyLocationData) {
  await connect();
  console.log("connected to db");
  const db = client.db("WealthTracker");
  const collection = db.collection("MoneyLocations");

  try {
    const result = await collection.insertOne(data);
    client.close();
    return result;
  } catch (error) {
    console.error("Error inserting money location:", error);
    throw error;
  }
}

export async function deleteMoneyLocation(money_location_id: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("MoneyLocations");

  try {
    const result = await collection.deleteOne({ money_location_id });
    client.close();
    return result;
  } catch (error) {
    console.error("Error deleting money location:", error);
    throw error;
  }
}

export async function updateMoneyLocation(
  money_location_id: string,
  updateData: Partial<MoneyLocationData>
) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("MoneyLocations");

  try {
    const result = await collection.updateOne(
      { money_location_id },
      { $set: updateData }
    );
    client.close();
    return result;
  } catch (error) {
    console.error("Error updating money location:", error);
    throw error;
  }
}

export async function getUserMoneyLocations(user_id: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("MoneyLocations");

  try {
    const result = await collection.find({ user_id }).toArray();
    client.close();
    return result;
  } catch (error) {
    console.error("Error getting user money locations:", error);
    throw error;
  }
}
