import express from "express";
import { logIn, signUp } from "./db/users-utils.js";

const router = express.Router();

// POST route for user registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create new user
    const newUser = await signUp(fullName, userName, email, password);

    // Return success response without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error during registration:", error);

    // Handle specific error messages
    if (error.message === "User with this email already exists") {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    if (error.message === "Username is already taken") {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// POST route for user login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required",
      });
    }

    // Authenticate user
    const user = await logIn(username, password);

    res.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    if (error.message === "Invalid password") {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }
  }
});

export default router;
