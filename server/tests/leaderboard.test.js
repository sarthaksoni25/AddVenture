const request = require('supertest');
const app = require('../app');
const { db } = require('../db'); // real sqlite db

beforeAll(() => {
  // Clean up any existing data
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM game_logs').run();

  // Insert known users and game logs
  const users = [
    { guestId: 'u1', name: 'Alice', isGuest: 0 },
    { guestId: 'u2', name: 'Bob', isGuest: 0 },
    { guestId: 'u3', name: 'Charlie', isGuest: 0 },
  ];

  const games = [
    { guestId: 'u1', score: 50, total: 5, time: 30.0, timestamp: new Date().toISOString() },
    { guestId: 'u2', score: 70, total: 5, time: 40.0, timestamp: new Date().toISOString() },
    { guestId: 'u3', score: 70, total: 5, time: 25.0, timestamp: new Date().toISOString() },
  ];

  const insertUser = db.prepare('INSERT INTO users (guestId, name, isGuest) VALUES (?, ?, ?)');
  const insertGame = db.prepare('INSERT INTO game_logs (guestId, score, total, time, timestamp) VALUES (?, ?, ?, ?, ?)');

  db.transaction(() => {
    users.forEach(user => insertUser.run(user.guestId, user.name, user.isGuest));
    games.forEach(game => insertGame.run(game.guestId, game.score, game.total, game.time, game.timestamp));
  })();
});

afterAll(() => {
  db.close();
});

describe('GET /api/leaderboard', () => {
  it('should return users sorted by bestScore DESC, then time ASC', async () => {
    const response = await request(app).get('/api/leaderboard');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(3);

    const names = response.body.map(entry => entry.name);

    // 🧠 Charlie and Bob both have 70 score but Charlie is faster (25.0 < 40.0)
    expect(names).toEqual(['Charlie', 'Bob', 'Alice']);
  });
});
