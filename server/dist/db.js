import { MongoClient, ServerApiVersion } from "mongodb";
const uri = "mongodb+srv://yotamsu26:wU60TrQxrpfAEDPN@wealthdata.mixbayt.mongodb.net/?retryWrites=true&w=majority&appName=WealthData";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
export var Currency;
(function (Currency) {
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
    Currency["GBP"] = "GBP";
    Currency["ILS"] = "ILS";
})(Currency || (Currency = {}));
export var AccountType;
(function (AccountType) {
    AccountType["CASH"] = "cash";
    AccountType["BANK_ACCOUNT"] = "bank_account";
    AccountType["PENSION_ACCOUNT"] = "pension_account";
    AccountType["REAL_ESTATE"] = "real_estate";
    AccountType["INVESTMENT"] = "investment";
})(AccountType || (AccountType = {}));
export async function connect() {
    try {
        await client.connect();
    }
    catch (error) {
        console.error("Error connecting to db:", error);
        throw error;
    }
}
export async function insertMoneyLocation(data) {
    await connect();
    console.log("connected to db");
    const db = client.db("WealthTracker");
    const collection = db.collection("MoneyLocations");
    try {
        const result = await collection.insertOne(data);
        client.close();
        return result;
    }
    catch (error) {
        console.error("Error inserting money location:", error);
        throw error;
    }
}
export async function deleteMoneyLocation(money_location_id) {
    await connect();
    const db = client.db("WealthTracker");
    const collection = db.collection("MoneyLocations");
    try {
        const result = await collection.deleteOne({ money_location_id });
        client.close();
        return result;
    }
    catch (error) {
        console.error("Error deleting money location:", error);
        throw error;
    }
}
export async function updateMoneyLocation(money_location_id, updateData) {
    await connect();
    const db = client.db("WealthTracker");
    const collection = db.collection("MoneyLocations");
    try {
        const result = await collection.updateOne({ money_location_id }, { $set: updateData });
        client.close();
        return result;
    }
    catch (error) {
        console.error("Error updating money location:", error);
        throw error;
    }
}
export async function getUserMoneyLocations(user_id) {
    await connect();
    const db = client.db("WealthTracker");
    const collection = db.collection("MoneyLocations");
    try {
        const result = await collection.find({ user_id }).toArray();
        client.close();
        return result;
    }
    catch (error) {
        console.error("Error getting user money locations:", error);
        throw error;
    }
}
