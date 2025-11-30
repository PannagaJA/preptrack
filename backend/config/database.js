const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'preptrack.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    college TEXT,
    branch TEXT,
    semester TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('Error creating users table:', err.message);
  });

  // Test results table
  db.run(`CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    test_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken INTEGER,
    correct_answers INTEGER,
    wrong_answers INTEGER,
    test_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) console.error('Error creating test_results table:', err.message);
  });

  // Roadmap progress table
  db.run(`CREATE TABLE IF NOT EXISTS roadmap_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    topic TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) console.error('Error creating roadmap_progress table:', err.message);
  });

  // Step progress table - NEW TABLE FOR STEP-LEVEL PROGRESS TRACKING
  db.run(`CREATE TABLE IF NOT EXISTS step_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    step_description TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, topic, step_index)
  )`, (err) => {
    if (err) console.error('Error creating step_progress table:', err.message);
  });

  // Leaderboard table (can be generated from test_results)
  db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    score INTEGER DEFAULT 0,
    tests_taken INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) console.error('Error creating leaderboard table:', err.message);
  });

  console.log('Database tables initialized');
}

// Add error handling for database operations
db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = db;