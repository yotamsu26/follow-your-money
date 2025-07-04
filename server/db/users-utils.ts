import { client, connect } from "./collection-utils.js";

export async function logIn(username: string, password: string) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Users");

  try {
    // Try to find user by email or username
    const result = await collection.findOne({
      userName: username,
    });

    if (!result) {
      throw new Error("User not found");
    }

    if (result.password !== password) {
      throw new Error("Invalid password");
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function signUp(
  fullName: string,
  userName: string,
  email: string,
  password: string
) {
  await connect();
  const db = client.db("WealthTracker");
  const collection = db.collection("Users");

  // Check if user already exists by email
  const existingUserByEmail = await collection.findOne({ email });
  if (existingUserByEmail) {
    throw new Error("User with this email already exists");
  }

  // Check if user already exists by username
  const existingUserByUsername = await collection.findOne({ userName });
  if (existingUserByUsername) {
    throw new Error("Username is already taken");
  }

  const newUser = {
    fullName,
    userName,
    email,
    password,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}
