const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ to parse JSON body

// Health-check route
app.get('/api/ping', (_, res) => res.json({ msg: 'pong' }));

// GET /api/sums → Random sums
app.get('/api/sums', (_, res) => {
  const sums = Array.from({ length: 5 }).map((_, idx) => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { id: idx, a, b, answer: a + b };
  });
  res.json(sums);
});

// ✅ NEW: POST /api/log → Save game stats
app.post('/api/log', (req, res) => {
  const logEntry = req.body;

  const filePath = path.join(__dirname, 'guest-logs.json');
  let logs = [];

  // Read existing logs
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath);
    logs = JSON.parse(raw);
  }

  // Append new entry
  logs.push(logEntry);

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  res.status(200).json({ status: 'ok', received: logEntry });
});
app.get('/api/leaderboard', (req, res) => {
  const filePath = path.join(__dirname, 'guest-logs.json');

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const logs = JSON.parse(fs.readFileSync(filePath));

  const grouped = {};

  for (const entry of logs) {
    // 🛡️ Skip if critical fields are missing
    if (typeof entry.score !== 'number' || !('guestId' in entry) || !('name' in entry)) continue;

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


app.listen(PORT, () => {
  console.log(`API running on ${PORT}`);
});
