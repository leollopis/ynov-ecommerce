const SEED_ORDERS = [
  { userId: 1, productIds: [1, 2], total: 1339.98, status: 'shipped',   createdAt: '2024-01-10' },
  { userId: 2, productIds: [3],    total: 149.99,  status: 'pending',   createdAt: '2024-01-12' },
  { userId: 1, productIds: [4, 5], total: 559.98,  status: 'delivered', createdAt: '2024-01-08' },
  { userId: 3, productIds: [3, 5], total: 449.98,  status: 'delivered', createdAt: '2024-01-09' },
];

function seedOrders(db) {
  const count = db.prepare('SELECT COUNT(*) as n FROM orders').get().n;
  if (count > 0) return;

  const insert = db.prepare(
    'INSERT INTO orders (userId, productIds, total, status, createdAt) VALUES (@userId, @productIds, @total, @status, @createdAt)'
  );

  SEED_ORDERS.forEach((order) => {
    insert.run({ ...order, productIds: JSON.stringify(order.productIds) });
  });
}

module.exports = { SEED_ORDERS, seedOrders };
