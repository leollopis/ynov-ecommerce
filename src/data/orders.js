const orders = [
  { id: 1, userId: 1, productIds: [1, 2], total: 1339.98, status: 'shipped', createdAt: '2024-01-10' },
  { id: 2, userId: 2, productIds: [3], total: 149.99, status: 'pending', createdAt: '2024-01-12' },
  { id: 3, userId: 1, productIds: [4, 5], total: 559.98, status: 'delivered', createdAt: '2024-01-08' },
  { id: 4, userId: 3, productIds: [3, 5], total: 449.98, status: 'delivered', createdAt: '2024-01-09' },
];

module.exports = orders;
