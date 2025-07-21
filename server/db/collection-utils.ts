import {
  client,
  connect,
  MoneyLocationData,
  GoalData,
  TransactionType,
} from "./database-schemas.js";

// Money Location CRUD operations
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

export async function getMonthlyExpenses(
  user_id: string,
  year: number,
  month: number
) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Transactions");

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await collection
      .find({
        user_id,
        type: TransactionType.EXPENSE,
        date: { $gte: startDate, $lte: endDate },
      })
      .toArray();

    client.close();
    return result;
  } catch (error) {
    console.error("Error getting monthly expenses:", error);
    throw error;
  }
}

// Goals CRUD operations
export async function insertGoal(data: GoalData) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Goals");

  try {
    const result = await collection.insertOne(data);
    client.close();
    return result;
  } catch (error) {
    console.error("Error inserting goal:", error);
    throw error;
  }
}

export async function deleteGoal(goal_id: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Goals");

  try {
    const result = await collection.deleteOne({ goal_id });
    client.close();
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
  const db = client.db("WealthTracker");
  const collection = db.collection("Goals");

  try {
    const result = await collection.updateOne(
      { goal_id },
      { $set: { ...updateData, updated_at: new Date() } }
    );
    client.close();
    return result;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
}

export async function getUserGoals(user_id: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Goals");

  try {
    const result = await collection.find({ user_id }).toArray();
    client.close();
    return result;
  } catch (error) {
    console.error("Error getting user goals:", error);
    throw error;
  }
}
