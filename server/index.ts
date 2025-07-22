import {
  insertMoneyLocation,
  deleteMoneyLocation,
  updateMoneyLocation,
  getUserMoneyLocations,
  insertGoal,
  deleteGoal,
  updateGoal,
  getUserGoals,
} from "./db/collection-utils.js";
import express from "express";
import { validData } from "./utils/validation-utils.js";
import authRouter from "./auth-api.js";
import fileRouter from "./routes/file-routes.js";
import { authenticateToken } from "./middleware/auth.js";
import cors from "cors";

const app = express();
const PORT = 3020;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Auth routes
app.use("/auth", authRouter);

// File routes
app.use("/files", fileRouter);

// GET route to get all money locations for a user (protected)
app.get("/money-locations/:user_id", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const moneyLocations = await getUserMoneyLocations(user_id);
    res.json({ success: true, data: moneyLocations });
  } catch (error) {
    console.error("Error fetching money locations:", error);
    res
      .status(500)
      .json({ success: false, message: "Can't fetch money locations" });
  }
});

// POST route to create a new money location (protected)
app.post("/money-locations", authenticateToken, async (req, res) => {
  try {
    const moneyLocationData = req.body;
    if (!validData(moneyLocationData)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const result = await insertMoneyLocation(moneyLocationData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating money location:", error);
    res
      .status(500)
      .json({ success: false, message: "Can't create money location" });
  }
});

// PUT route to update a money location (protected)
app.put(
  "/money-locations/:money_location_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { money_location_id } = req.params;
      const updateData = req.body;
      const result = await updateMoneyLocation(money_location_id, updateData);

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Money location not found" });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error updating money location:", error);
      res
        .status(500)
        .json({ success: false, message: "Can't update money location" });
    }
  }
);

// DELETE route to delete a money location (protected)
app.delete(
  "/money-locations/:money_location_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { money_location_id } = req.params;
      const userId = (req as any).user.userId;
      const result = await deleteMoneyLocation(money_location_id, userId);

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Money location not found" });
      }

      res.json({
        success: true,
        message: "Money location deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting money location:", error);
      res
        .status(500)
        .json({ success: false, message: "Can't delete money location" });
    }
  }
);

// Goals Routes

// GET route to get all goals for a user (protected)
app.get("/goals/:user_id", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const goals = await getUserGoals(user_id);
    res.json({ success: true, data: goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ success: false, message: "Can't fetch goals" });
  }
});

// POST route to create a new goal (protected)
app.post("/goals", authenticateToken, async (req, res) => {
  try {
    const goalData = req.body;

    // Validate required fields
    if (!goalData.user_id || !goalData.name || !goalData.target_amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, name, target_amount",
      });
    }

    // Add timestamps
    goalData.created_at = new Date();
    goalData.updated_at = new Date();

    const result = await insertGoal(goalData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ success: false, message: "Can't create goal" });
  }
});

// PUT route to update a goal (protected)
app.put("/goals/:goal_id", authenticateToken, async (req, res) => {
  try {
    const { goal_id } = req.params;
    const updateData = req.body;

    // Add timestamps
    updateData.updated_at = new Date();

    const result = await updateGoal(goal_id, updateData);

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ success: false, message: "Can't update goal" });
  }
});

// DELETE route to delete a goal (protected)
app.delete("/goals/:goal_id", authenticateToken, async (req, res) => {
  try {
    const { goal_id } = req.params;
    const result = await deleteGoal(goal_id);

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ success: false, message: "Can't delete goal" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
