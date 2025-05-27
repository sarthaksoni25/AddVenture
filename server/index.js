require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 5000;

// HTTPS certs (relative to server directory)
const key = fs.readFileSync(path.resolve(__dirname, "../certs/key.pem"));
const cert = fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem"));

const allowedOrigins = [
  "https://add-venture.xyz",
  "https://www.add-venture.xyz",
  "http://localhost:5173", // keep this if using local dev
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

app.use(express.json()); // ✅ to parse JSON body
app.use((err, req, res, next) => {
  console.error("💥 Global error caught:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Google OAuth
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ✅ POST /api/auth → Google Login
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

// ✅ GET /api/ping
app.get("/api/ping", (_, res) => res.json({ msg: "pong" }));

// ✅ GET /api/sums → Random sums
app.get("/api/sums", (_, res) => {
  const sums = Array.from({ length: 5 }).map((_, idx) => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { id: idx, a, b, answer: a + b };
  });
  res.json(sums);
});

// ✅ POST /api/log → Save game stats
app.post("/api/log", (req, res) => {
  const logEntry = req.body;
  const filePath = path.join(__dirname, "guest-logs.json");
  let logs = [];

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath);
    logs = JSON.parse(raw);
  }

  logs.push(logEntry);
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  res.status(200).json({ status: "ok", received: logEntry });
});

// ✅ GET /api/leaderboard
app.get("/api/leaderboard", (req, res) => {
  const filePath = path.join(__dirname, "guest-logs.json");

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const logs = JSON.parse(fs.readFileSync(filePath));
  const grouped = {};

  for (const entry of logs) {
    if (
      typeof entry.score !== "number" ||
      !("guestId" in entry) ||
      !("name" in entry)
    )
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

// ✅ Start HTTPS server
https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`🔐 HTTPS API running on https://localhost:${PORT}`);
});
