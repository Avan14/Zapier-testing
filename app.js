const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
  })
);

app.post("/webhook", async (req, res) => {
  try {
    // Verify API key
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = req.body;
    // Validate inputs
    if (!data.name || !data.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save to MongoDB
    await client.connect();
    const db = client.db("zapier");
    await db.collection("responses").insertOne({
      ...data,
      timestamp: new Date(),
    });

    console.log("Saved data:", data);
    res.status(200).json({ status: "success", received: data });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
