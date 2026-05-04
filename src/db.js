const Database = require('better-sqlite3');
const path = require('path');

let instance = null;

function getDb() {
  if (!instance) {
    const dbPath = process.env.DB_PATH || path.join(__dirname, '../db/ecommerce.sqlite');
    instance = new Database(dbPath);
    instance.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productIds TEXT NOT NULL,
        total REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL
      )
    `);
  }
  return instance;
}

function setDb(db) {
  instance = db;
}

module.exports = { getDb, setDb };
