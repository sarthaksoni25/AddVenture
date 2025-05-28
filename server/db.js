// db.js
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "adventure.db"));
db.pragma("foreign_keys = ON");

/* ─────────────────────── TABLES ─────────────────────── */
db.prepare(/* sql */`
  CREATE TABLE IF NOT EXISTS users (
    guestId TEXT PRIMARY KEY,
    name    TEXT NOT NULL,
    isGuest INTEGER NOT NULL          -- 0 | 1
  );
`).run();

db.prepare(/* sql */`
  CREATE TABLE IF NOT EXISTS game_logs (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    guestId   TEXT    NOT NULL,
    score     INTEGER NOT NULL,
    total     INTEGER NOT NULL,
    time      REAL    NOT NULL,
    timestamp TEXT    NOT NULL,
    FOREIGN KEY (guestId) REFERENCES users (guestId)
  );
`).run();

/* ──────────────────── PREPARED STMTs ─────────────────── */
const upsertUser = db.prepare(/* sql */`
  INSERT INTO users (guestId, name, isGuest)
  VALUES (@guestId, @name, @isGuest)
  ON CONFLICT (guestId) DO UPDATE SET
    name    = excluded.name,
    isGuest = excluded.isGuest;
`);

const insertGame = db.prepare(/* sql */`
  INSERT INTO game_logs (guestId, score, total, time, timestamp)
  VALUES      (@guestId, @score, @total, @time, @timestamp);
`);

module.exports = {
  db,
  upsertUser,
  insertGame,
};
