require("dotenv").config();
const db = require("./db"); // if using require
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://add-venture.xyz",
  "https://www.add-venture.xyz",
  "http://localhost:5173",
  "https://localhost:5173", // ✅ add this if using HTTPS on Vite
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use((err, req, res, next) => {
  console.error("💥 Global error caught:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Google OAuth
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post("/api/auth", async (req, res) => {
  console.log("🛬 Incoming Google login...");
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "Missing credential" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    console.log("✅ Verified user:", name, email);
    res.json({ success: true, name, email, picture });
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.get("/api/ping", (_, res) => res.json({ msg: "pong" }));

app.get("/api/sums", (_, res) => {
  const sums = Array.from({ length: 5 }).map((_, idx) => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { id: idx, a, b, answer: a + b };
  });
  res.json(sums);
});

app.post("/api/log", (req, res) => {
  const {
    guestId = null,
    name = "Guest",
    isGuest = true,
    score = 0,
    total = 0,
    time = null,
    timestamp = new Date().toISOString(),
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO guest_logs (guestId, name, isGuest, score, total, time, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      guestId,
      name,
      isGuest ? 1 : 0, // ✅ Boolean fix
      score,
      total,
      time,
      timestamp
    );

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "DB insert failed" });
  }
});

app.get("/api/leaderboard", (req, res) => {
  const logs = db.prepare(`SELECT * FROM guest_logs`).all();
  const grouped = {};

  for (const entry of logs) {
    if (typeof entry.score !== "number" || !entry.guestId || !entry.name)
      continue;

    const key = entry.isGuest ? entry.guestId : entry.name || "Unnamed";

    if (!grouped[key]) {
      grouped[key] = {
        name: entry.name || "Guest",
        isGuest: entry.isGuest ?? true,
        guestId: entry.guestId,
        bestScore: entry.score,
        total: entry.total,
        time: entry.time,
        timestamp: entry.timestamp,
      };
    } else {
      if (entry.score > grouped[key].bestScore) {
        grouped[key] = {
          ...grouped[key],
          bestScore: entry.score,
          total: entry.total,
          time: entry.time,
          timestamp: entry.timestamp,
        };
      }
    }
  }

  const leaderboard = Object.values(grouped)
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, 10);

  res.json(leaderboard);
});

// Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 HTTP API running on http://localhost:${PORT}`);
});
