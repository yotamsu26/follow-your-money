import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client, connect } from "./database-schemas.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SALT_ROUNDS = 12;

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

    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, result.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result._id,
        userName: result.userName,
        email: result.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data without password but with token
    const { password: _, ...userWithoutPassword } = result;
    return { ...userWithoutPassword, token };
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

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = {
    fullName,
    userName,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return { ...userWithoutPassword, _id: result.insertedId };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
