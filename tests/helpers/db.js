const Database = require('better-sqlite3');
const { setDb } = require('../../src/db');
const { SEED_ORDERS } = require('../../src/seed');

function setupTestDb() {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productIds TEXT NOT NULL,
      total REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL
    )
  `);

  const insert = db.prepare(
    'INSERT INTO orders (userId, productIds, total, status, createdAt) VALUES (@userId, @productIds, @total, @status, @createdAt)'
  );

  SEED_ORDERS.forEach((order) => {
    insert.run({ ...order, productIds: JSON.stringify(order.productIds) });
  });

  setDb(db);
  return db;
}

module.exports = { setupTestDb };
