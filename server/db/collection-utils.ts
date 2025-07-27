import { client, MoneyLocationData, GoalData } from "./database-schemas.js";
import { deleteFilesByMoneyLocationId } from "./files-utils.js";
import {
  WEALTH_TRACKER_DB,
  MONEY_LOCATIONS_COLLECTION,
  GOALS_COLLECTION,
} from "./db-consts.js";

let isConnected = false;

export async function connect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("MongoDB connected");
  }
}

// Money Location CRUD operations
export async function insertMoneyLocation(data: MoneyLocationData) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(MONEY_LOCATIONS_COLLECTION);

  try {
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    console.error("Error inserting money location:", error);
    throw error;
  }
}

export async function deleteMoneyLocation(
  money_location_id: string,
  user_id: string
) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(MONEY_LOCATIONS_COLLECTION);

  try {
    // First, delete all associated files
    await deleteFilesByMoneyLocationId(user_id, money_location_id);

    const result = await collection.deleteOne({ money_location_id });
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
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(MONEY_LOCATIONS_COLLECTION);

  try {
    const result = await collection.updateOne(
      { money_location_id },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    console.error("Error updating money location:", error);
    throw error;
  }
}

export async function getUserMoneyLocations(user_id: string) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(MONEY_LOCATIONS_COLLECTION);

  try {
    const result = await collection.find({ user_id }).toArray();
    return result;
  } catch (error) {
    console.error("Error getting user money locations:", error);
    throw error;
  }
}

// Goals CRUD operations
export async function insertGoal(data: GoalData) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(GOALS_COLLECTION);

  try {
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    console.error("Error inserting goal:", error);
    throw error;
  }
}

export async function deleteGoal(goal_id: string) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(GOALS_COLLECTION);

  try {
    const result = await collection.deleteOne({ goal_id });
    return result;
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error;
  }
}

export async function updateGoal(
  goal_id: string,
  updateData: Partial<GoalData>
) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(GOALS_COLLECTION);

  try {
    const result = await collection.updateOne(
      { goal_id },
      { $set: { ...updateData, updated_at: new Date() } }
    );
    return result;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
}

export async function getUserGoals(user_id: string) {
  await connect();
  const db = client.db(WEALTH_TRACKER_DB);
  const collection = db.collection(GOALS_COLLECTION);

  try {
    const result = await collection.find({ user_id }).toArray();
    return result;
  } catch (error) {
    console.error("Error getting user goals:", error);
    throw error;
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Closing MongoDB connection...`);
  if (isConnected) {
    await client.close();
    isConnected = false;
    console.log("MongoDB connection closed.");
  }
  process.exit(0);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGQUIT", () => gracefulShutdown("SIGQUIT"));
