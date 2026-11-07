// server.js
// ─────────────────────────────────────────────────
// Install: npm install express cors better-sqlite3
// Run:     node server.js
// ─────────────────────────────────────────────────

const express = require('express');
const cors    = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db  = new Database('satyarth_gunj.db'); // creates the .db file automatically

app.use(cors());
app.use(express.json());

// ── CREATE TABLES (runs once on startup) ─────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL,
    message     TEXT    NOT NULL,
    submitted_at DATETIME DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', 'satyarth123');
`);

console.log('✅  Database ready: satyarth_gunj.db');

// ── POST /login ───────────────────────────────────────────────────
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare(
    'SELECT * FROM admins WHERE username = ? AND password = ?'
  ).get(username, password);

  if (admin) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// ── POST /contacts — save new submission ──────────────────────────
app.post('/contacts', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const stmt   = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
  const result = stmt.run(name, email, message);
  res.json({ success: true, id: result.lastInsertRowid, message: 'Saved to database!' });
});

// ── GET /contacts — fetch all submissions ─────────────────────────
app.get('/contacts', (req, res) => {
  const rows = db.prepare('SELECT * FROM contacts ORDER BY submitted_at DESC').all();
  res.json(rows);
});

// ── DELETE /contacts/:id ──────────────────────────────────────────
app.delete('/contacts/:id', (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── START ─────────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log('🚀  Server running at http://localhost:3000');
  console.log('📋  Contacts  : GET  http://localhost:3000/contacts');
  console.log('📨  Submit    : POST http://localhost:3000/contacts');
  console.log('🔐  Login     : POST http://localhost:3000/login');
  console.log('');
});