import {
  insertMoneyLocation,
  deleteMoneyLocation,
  updateMoneyLocation,
  getUserMoneyLocations,
  insertTransaction,
  getUserTransactions,
  getTransactionsByCategory,
  getMonthlyExpenses,
} from "./db/collection-utils.js";
import express from "express";
import { validData } from "./utils/validation-utils.js";
import authRouter from "./auth-api.js";
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Auth routes
app.use("/auth", authRouter);

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
      const result = await deleteMoneyLocation(money_location_id);

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

// Transaction Routes

// POST route to create a new transaction (protected)
app.post("/transactions", authenticateToken, async (req, res) => {
  try {
    const transactionData = req.body;

    // Validate required fields
    if (
      !transactionData.user_id ||
      !transactionData.type ||
      !transactionData.amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, type, amount",
      });
    }

    const result = await insertTransaction(transactionData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res
      .status(500)
      .json({ success: false, message: "Can't create transaction" });
  }
});

// GET route to get user transactions (protected)
app.get("/transactions/:user_id", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const transactions = await getUserTransactions(user_id, limit);
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ success: false, message: "Can't fetch transactions" });
  }
});

// GET route to get transactions by category (protected)
app.get(
  "/transactions/:user_id/category/:category",
  authenticateToken,
  async (req, res) => {
    try {
      const { user_id, category } = req.params;
      const transactions = await getTransactionsByCategory(
        user_id,
        category as any
      );
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error("Error fetching transactions by category:", error);
      res.status(500).json({
        success: false,
        message: "Can't fetch transactions by category",
      });
    }
  }
);

// GET route to get monthly expenses (protected)
app.get(
  "/transactions/:user_id/monthly/:year/:month",
  authenticateToken,
  async (req, res) => {
    try {
      const { user_id, year, month } = req.params;
      const transactions = await getMonthlyExpenses(
        user_id,
        parseInt(year),
        parseInt(month)
      );
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
      res
        .status(500)
        .json({ success: false, message: "Can't fetch monthly expenses" });
    }
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
