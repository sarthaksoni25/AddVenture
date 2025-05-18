const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

// simple health-check route
app.get('/api/ping', (_, res) => res.json({ msg: 'pong' }));

app.listen(PORT, () => {
  console.log(`API running on ${PORT}`);
});

// GET /api/sums  →  ten random “a + b = ?” objects
app.get('/api/sums', (_, res) => {
  const sums = Array.from({ length: 2 }).map((_, idx) => {
    const a = Math.floor(Math.random() * 20) + 1; // 1-20
    const b = Math.floor(Math.random() * 20) + 1;
    return { id: idx, a, b, answer: a + b }; // keep answer for auto-check
  });
  res.json(sums);
});
// test