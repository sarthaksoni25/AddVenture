const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// simple health-check route
app.get('/api/ping', (_, res) => res.json({ msg: 'pong' }));

app.listen(PORT, () => {
  console.log(`API running on ${PORT}`);
});
