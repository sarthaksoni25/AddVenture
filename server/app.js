require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db, upsertUser, insertGame } = require("./db");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");

const app = express();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const allowedOrigins = [
  "https://add-venture.xyz",
  "https://www.add-venture.xyz",
  "http://localhost:5173",
  "https://localhost:5173",
];

// Middleware
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
  } )
);

app.use(express.json());

// Global Error handler
app.use((err, req, res, next) => {
  console.error("💥 Global error caught:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Routes
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

  if (!guestId) {
    return res.status(400).json({ error: "guestId required" });
  }

  try {
    db.transaction(({ user, score, total, time, timestamp }) => {
      upsertUser.run({
        guestId: user.guestId,
        name: user.name,
        isGuest: user.isGuest ? 1 : 0,
      });
      insertGame.run({
        guestId: user.guestId,
        score,
        total,
        time: parseFloat(time),
        timestamp,
      });
    })({
      user: { guestId, name, isGuest },
      score,
      total,
      time,
      timestamp,
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "DB insert failed" });
  }
});

app.get("/api/leaderboard", (req, res) => {
  const rows = db.prepare(`
    /* 1️⃣  best_score: one row per user with their max score */
    WITH best_score AS (
      SELECT guestId, MAX(score) AS bestScore
      FROM game_logs
      GROUP BY guestId
    ),
    /* 2️⃣  best_round: tie‑break with MIN(time) for that score */
    best_round AS (
      SELECT g.*
      FROM game_logs g
      JOIN best_score b
        ON g.guestId = b.guestId
       AND g.score   = b.bestScore
      WHERE g.time = (
        SELECT MIN(time)
        FROM game_logs
        WHERE guestId = g.guestId
          AND score   = g.score
      )
    )
    /* 3️⃣  pull user info and sort */
    SELECT u.guestId,
           u.name,
           u.isGuest,
           br.score     AS bestScore,
           br.total,
           br.time,
           br.timestamp
    FROM best_round br
    JOIN users u ON u.guestId = br.guestId
    ORDER BY bestScore DESC, time ASC;   -- remove LIMIT to keep everyone
  `).all();

  res.json(rows.map(r => ({ ...r, isGuest: !!r.isGuest })));
});


app.get("/api/history/:guestId", (req, res) => {
  const { guestId } = req.params;

  if (!guestId) return res.status(400).json({ error: "guestId required" });

  const rows = db
    .prepare(
      `
    SELECT score, total, time, timestamp
    FROM   game_logs
    WHERE  guestId = ?
    ORDER  BY timestamp DESC
    LIMIT  5;
  `
    )
    .all(guestId);

  res.json(rows);
});

const renameUser = db.prepare(`
  UPDATE users
  SET    name = ?
  WHERE  guestId = ?;
`);

app.post("/api/rename", (req, res) => {
  const { guestId, newName = "" } = req.body || {};

  if (!guestId || !newName.trim())
    return res.status(400).json({ error: "guestId and newName required" });
  if (!/^[a-zA-Z0-9_-]{3,15}$/.test(newName))
    return res
      .status(400)
      .json({ error: "Name must be 3-15 chars, a-z, 0-9, _ or -" });

  try {
    const info = renameUser.run(newName.trim(), guestId);
    if (info.changes === 0)
      return res.status(404).json({ error: "guestId not found" });

    res.json({ status: "ok", newName });
  } catch (err) {
    console.error("Rename error:", err);
    res.status(500).json({ error: "Rename failed" });
  }
});

module.exports = app;
