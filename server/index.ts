import {
  connect,
  insertMoneyLocation,
  deleteMoneyLocation,
  updateMoneyLocation,
  getUserMoneyLocations,
} from "./db/collection-utils.js";
import express from "express";
import { validData } from "./utils/validation-utils.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// GET route to get all money locations for a user
app.get("/money-locations/:user_id", async (req, res) => {
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

// POST route to create a new money location
app.post("/money-locations", async (req, res) => {
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

// PUT route to update a money location
app.put("/money-locations/:money_location_id", async (req, res) => {
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
});

// DELETE route to delete a money location
app.delete("/money-locations/:money_location_id", async (req, res) => {
  try {
    const { money_location_id } = req.params;
    const result = await deleteMoneyLocation(money_location_id);

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Money location not found" });
    }

    res.json({ success: true, message: "Money location deleted successfully" });
  } catch (error) {
    console.error("Error deleting money location:", error);
    res
      .status(500)
      .json({ success: false, message: "Can't delete money location" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
