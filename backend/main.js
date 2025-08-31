import { createServer } from "node:http";
import { MongoClient } from "mongodb";
import { URL } from "url";

// ---- config ----
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "mongodb";
const PORT = parseInt(process.env.PORT || "3000", 10);

// ---- mongo setup ----
let client;
let db;

async function initMongo() {
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`[mongo] connected -> ${MONGODB_URI} db=${DB_NAME}`);
}

// ---- request handler ----
async function handler(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/users") {
    try {
      const users = await db.collection("users").find({}).toArray();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(users));
      return;
    } catch (err) {
      console.error("[server] fetch users failed", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Failed to fetch users" }));
      return;
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({}));
}

async function start() {
  try {
    await initMongo();
    const server = createServer(handler);
    server.listen(PORT, () => {
      console.log(`[server] running at http://localhost:${PORT}`);
    });

    process.on("SIGINT", async () => {
      console.log("\n[server] shutting down…");
      server.close();
      if (client) await client.close().catch(() => {});
      process.exit(0);
    });
  } catch (e) {
    console.error("[start] fatal", e);
    process.exit(1);
  }
}

start();
