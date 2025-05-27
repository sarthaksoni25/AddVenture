const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'adventure.db'));

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS guest_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guestId TEXT,
    name TEXT,
    isGuest BOOLEAN,
    score INTEGER,
    total INTEGER,
    time TEXT,
    timestamp TEXT
  )
`).run();

module.exports = db;
