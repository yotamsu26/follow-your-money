import { client, connect } from "./collection-utils";

export async function logIn(email: string, password: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Users");

  try {
    const result = await collection.findOne({ email });
    if (!result) {
      throw new Error("User not found");
    }
    if (result.password !== password) {
      throw new Error("Invalid password");
    }
    return result;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Users");

  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = { email, password };
  await collection.insertOne(newUser);
}
